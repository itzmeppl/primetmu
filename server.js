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
    const newUser = { id: Date.now(), username, password, admin: false };
    temp = new User(newUser);
    await temp.save();
    res.status(201).json(newUser);
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
        const { title, item_type, category, description, price, location } = req.body;
        const image_path = req.file ? req.file.path : null; // Get file path if file uploaded

        // add user_id & item_id
        const newAd = new Ads({ title, item_type, category, description, price, location, image_path });
        await newAd.save();

        res.status(201).json(newAd); // Send JSON response for successful request
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
