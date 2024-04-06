const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
const primeTMUMongoDB = process.env.MONGODB_URI;
const server = http.createServer(app)

const saltRounds = 10; // Number of salt rounds for bcrypt

const io = new Server(server, {
    cors: {
        origin: "http://itzmeppl.github.io/primetmu",
        methods: ["GET", "POST"],
    },
});

mongoose.connect(primeTMUMongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({ username: String, password: String, admin: Boolean, rooms: Array });
const User = mongoose.model('Users', userSchema);
const adSchema = new mongoose.Schema({
    item_type: String,
    username: String,
    category: String,
    description: String,
    title: String,
    location: String,
    price: String,
    image_path: String
});
const Ads = mongoose.model('Ads', adSchema);
const keywordSchema = new mongoose.Schema({ title: String, keywords: String });
const Keywords = mongoose.model('Keywords', keywordSchema);
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
const Msg = mongoose.model('Message', MsgSchema);
const Rooms = mongoose.model('Rooms', RoomsSchema);

app.use(cors({
    origin: 'https://itzmeppl.github.io/' // Allow requests from your GitHub Pages origin
  }));
app.use(express.json());
app.use('/image_upload', express.static(path.join(__dirname, 'image_upload')));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image_upload/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// user table
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);
    const user = await User.findOne({ username: username });
    console.log("User", user);

    if (user) {
        console.log('Username already exists!');
        res.status(400).json({ error: 'Username already exists!' });
        return;
    }
    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user with hashed password to the database
        const newUser = new User({ username, password: hashedPassword, admin: false });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    //finding password for the given username
    const userPass = await User.find({ username: username });
    console.log(userPass)
});

app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        res.json(deletedUser);
    } catch (error) {
        // If an error occurs during the deletion process, return 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Users Login
app.post('/api/usersLogin', async (req, res) => {
    const { username, password } = req.body;

    //finding password for the given username
    const user = await User.findOne({ username: username });
    console.log("user", user);
    if (user) {
        const userPass = user.password;
        const admin = user.admin;
        console.log(userPass);
        console.log("DB userpass:", userPass);
        console.log("Inputted pass:", password);
        bcrypt.compare(password, userPass, function (err, result) {
            if (err) {
                console.error(err.message);
            }
            if (res && admin) {
                console.log("Admin Found");
                res.status(200).json({ message: "User found!" });
            }
            else if (res) {
                console.log("User Found");
                res.status(201).json({ message: "User found!" });
            }
            else {
                return res.status(500).json({ error: 'Passwords do not match' });

            }
        });
    }
    else {
        console.log("Incorrect Password");
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ad table
app.get('/api/ads', async (req, res) => {
    try {
        const ads = await Ads.find();
        res.json(ads);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// ad upload
app.post('/api/ads', upload.single('image_path'), async (req, res) => {
    try {
        const { title, item_type, category, description, price, location, username } = req.body;
        const image_path = req.file ? req.file.path : null; // Get file path if file uploaded

        const newAd = new Ads({ title, item_type, category, description, price, location, image_path, username });
        await newAd.save();

        res.status(201).json(newAd); // Send JSON response for successful request
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
    }
});

app.delete('/api/ads/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const matchedAd = await Ads.findByIdAndDelete(id);
        res.json(matchedAd);
        console.log(matchedAd);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error' });6
    }
    
}); 

// keywords
app.get('/api/keywords', async (req, res) => {
    try {
        const newKeywords = await Keywords.find();
        res.json(newKeywords);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/keywords', async (req, res) => {
    try {
        const { keywords } = req.body;

        // add user_id & item_id
        const newKeywords = new Keywords({ keywords });
        await newKeywords.save();

        res.status(201).json(newKeywords); // Send JSON response for successful request
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
    }
});

app.get('/api/search', async (req, res) => {
    console.log(req.query.term + "bye");
    const search = req.query.term.split(' ');
    console.log(search);
    if (search[0] === "Title") {
        console.log(search[1]);
        const keywords = await Keywords.find({ keywords: search[1] });
        res.json(keywords);
        console.log(keywords);
    }
    else if (search[0] === "Location") {
        let temp = "";
        for (let i = 1; i < search.length; i++) {
            temp += search[i] + " ";
            console.log(temp + "hi");
        }
        temp = temp.substring(0, temp.length - 1);
        console.log(temp);
        const locations = await Ads.find({ location: temp });
        res.json(locations);
        console.log(locations);
    }
});

//add new room for curUser and otherUser
app.post('/api/users/newRoom', async (req, res) => {
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
        let newRoom = await Rooms.findOne({ roomNum: room });
        if (!user.rooms.includes(room) && !user.rooms.includes(otherRoom)) {
            user.rooms.push(room);
            poster.rooms.push(room);
            newRoom = new Rooms({ roomNum: room, allMessages: [], users: [] });
            await user.save();
            await poster.save();
            await newRoom.save();
            io.emit("new_room", "newRoom");
        }
        else
            return res.status(404).json({ error: 'Room Exists' });

        res.status(200).json({ message: 'Room created successfully' });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});
// Message Stuff
app.get('/api/userRooms', async (req, res) => {
    const { user } = req.query;
    try {
        if (!user) {
            return res.status(400).json({ error: 'user cannot be empty' });
        }
        const userRooms = await User.findOne({ username: user });
        res.json(userRooms);
    }
    catch (error) {
        console.error('Failed to Fetch', error);
    }
});

app.get('/api/rooms', async (req, res) => {
    const { room } = req.query;
    try {
        if (!room) {
            return res.status(400).json({ error: 'room cannot be empty' });
        }
        const dbRoom = await Rooms.findOne({ roomNum: room })
        res.json(dbRoom);


    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


app.post('/api/rooms', async (req, res) => {
    const { message, givRoom, author } = req.body;
    if (!message || !givRoom || !author) {
        return res.status(400).json({ error: 'message and givRoom and author are required' });
    }
    try {
        let room = await Rooms.findOne({ roomNum: givRoom });
        if (!room) {
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
    socket.on("send_message", async (data) => {
        const { message, givRoom, author } = data;
        try {
            // Save the message to the database
            const newMsg = { id: Date.now(), message, author: author };
            const tempMsg = new Msg(newMsg);
            const room = await Rooms.findOneAndUpdate(
                { roomNum: givRoom },
                { $push: { allMessages: tempMsg } },
                { new: true }
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
