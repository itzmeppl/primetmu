const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/primetmu', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({ username: String, password: String, admin: Boolean });
const User = mongoose.model('Users', userSchema);
// TO DO: get info from cookies: 
// item_id: String
// user_id: String
const adSchema = new mongoose.Schema({
    item_type: String,
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

app.use(cors());
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
    const { username, password, admin } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        console.log('Username already exists!');
        res.status(400).json({ error: 'Username already exists!' });
        return;
    }
    const newUser = {username, password, admin: false };
    temp = new User(newUser);
    await temp.save();
    res.status(201).json(newUser);
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
app.post('/api/ads', upload.single('image_upload'), async (req, res) => {
    try {
        const { title, item_type, category, description, price, location } = req.body;
        const image_path = req.file ? req.file.path : null; // Get file path if file uploaded

        const newAd = new Ads({ title, item_type, category, description, price, location, image_path });
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
        const { title, keywords } = req.body;

        // add user_id & item_id
        const newKeywords = new Keywords({ title, keywords });
        await newKeywords.save();

        res.status(201).json(newKeywords); // Send JSON response for successful request
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
    }
});

app.get('/api/search', async(req, res) => {
    console.log(req.query.term + "bye");
    const search = req.query.term.split(' ');
    console.log(search);
    if (search[0] === "Title"){
        console.log(search[1]);
        const keywords = await Keywords.find({keywords: search[1]});
        res.json(keywords);
        console.log(keywords);
    }
    else if (search[0] === "Location"){
        let temp = "";
        for (let i = 1; i < search.length; i++){
            temp += search[i] + " ";
            console.log(temp+"hi");
        }
        temp = temp.substring(0,temp.length-1);
        console.log(temp);
        const locations = await Ads.find({location: temp});
        res.json(locations);
        console.log(locations);
    }
    // else{
    //     const locs = await Ads.find({lo})
    // }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});