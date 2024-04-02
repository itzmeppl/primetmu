const mongoose = require('mongoose');
const express = require("express");
const app = express();
const http = require("http");
const {Server}  = require("socket.io");
const cors = require("cors");
const { measureMemory } = require('vm');
const PORT = process.env.PORT || 3001;



app.use(cors());
app.use(express.json());
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

mongoose.connect('mongodb://localhost:27017/register', {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({username: String, password: String, admin: Boolean, rooms: Array});
const User = mongoose.model('Post',userSchema);

const MsgSchema = new mongoose.Schema({
    id: Number,
    message: String,
    author: String,
});
const RoomsSchema = new mongoose.Schema({
    roomNum: String,
    allMessages: [MsgSchema],
    users: Array
})
const Msg = mongoose.model('Message',MsgSchema);
const Rooms = mongoose.model('Rooms',RoomsSchema);



app.get('/api/posts', async(req, res) => {
    try {
        const posts = await User.find();
        res.json(posts);
    }
    catch(err){
        res.status(500).send(err);
    }
});

app.post('/api/posts', async(req, res) => {
    const { username, password, admin} = req.body;
    const user = await User.findOne({username});
    if (user){
        console.log('Username already exists!');
        res.status(400).json({ error: 'Username already exists!'});
        return;
    }
    const newPost = { id: Date.now(), username, password, admin: false, rooms: []};
    temp = new User(newPost);
    await temp.save();
    res.status(201).json(newPost);
});

//add new room for curUser and otherUser
app.post('/api/posts/newRoom', async (req, res) => {
    const { curUser, otherUser } = req.body;
    if (!curUser || !otherUser) {
        return res.status(400).json({ error: 'Both current and other user are required' });
    }
    try {
        const user = await User.findOne({ username: curUser });
        const poster = await User.findOne({ username: otherUser });
        if (!user || !poster) {
            return res.status(404).json({ error: 'User not found' });
        }
        const room = user.username.concat("-", poster.username);
        const otherRoom = poster.username.concat("-", user.username);

        if (!user.rooms) {
            user.rooms = [];
        }
        if (!poster.rooms) {
            poster.rooms = [];
        }
        // if no room between these 2 ppl
        let newRoom = await Rooms.findOne({ roomNum: room});
        if (!user.rooms.includes(room) && !user.rooms.includes(otherRoom)) {
            user.rooms.push(room);
            poster.rooms.push(room);
            newRoom = new Rooms({ roomNum: room, allMessages: [], users: [] });
        }
        else
            return res.status(404).json({ error: 'Room Exists' });
        await user.save();
        await poster.save();
        await newRoom.save();
        res.status(200).json({ message: 'Room created successfully' });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});
// Message Stuff
app.get('/api/userRooms', async (req, res) => {
    const {user} = req.query;
    try{
        if (!user){
            return res.status(400).json({ error: 'user cannot be empty' });
        }
        const userRooms = await User.findOne({username: user});
        res.json(userRooms);
    }
    catch(error){
        console.error('Failed to Fetch', error);
    }
});

app.get('/api/rooms', async (req, res) => {
    const { room } = req.query;
    try {
        if (!room){
            return res.status(400).json({ error: 'room cannot be empty' });
        }
        const dbRoom = await Rooms.findOne({roomNum: room})
        res.json(dbRoom);
        
        
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


app.post('/api/rooms', async (req, res) =>{
    const { message, givRoom, author } = req.body;
    if (!message || !givRoom || !author){
        return res.status(400).json({ error: 'message and givRoom and author are required' });
    }
    try {
        let room = await Rooms.findOne({ roomNum: givRoom });
        if (!room){
            room = new Rooms({ roomNum: givRoom, allMessages: [], users: [] });
        }
        const newMsg = { id: Date.now(), message, author: author };
        const tempMsg = new Msg(newMsg);
        room.allMessages.push(tempMsg);
        await room.save();
        res.status(201).json({ message: 'Message added to room: ', room });
    } catch (error) {
        console.error('Error adding message to room:', error);
        res.status(500).json({ error: 'Failed to add message to room' });
    }
});

io.on("connection", (socket) => {
    //join room
    socket.on("join_room", (data) => {
        socket.join(data);
    });

    //send msg to room
    socket.on("send_message", async(data) => {
        const { message, givRoom, author } = data;
        try {
            // Save the message to the database
            const newMsg = { id: Date.now(), message, author: author };
            const tempMsg = new Msg(newMsg);
            const room = await Rooms.findOneAndUpdate(
                {roomNum: givRoom},
                {$push: {allMessages: tempMsg}},
                {new: true}
            );

            if (room) {
                // Emit the new message to the room
                await io.to(givRoom).emit("receive_message", givRoom);
            } else {
                console.log('Room not found');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
  });

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});