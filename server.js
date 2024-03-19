const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/register', {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({username: String, password: String, admin: Boolean});
const User = mongoose.model('Post',userSchema);

app.use(cors());
app.use(express.json());

app.get('/api/posts', async(req, res) => {
    try {
        const posts = await User.find();
        res.json(posts);
    }
    catch(err){
        res.status(500).send(err);
    }
});

/* app.get('/api/homeData', async (req, res) => {
    const homeData = {
    message: 'Welcome to our website! Explore our blog for interesting articles.'
    };
    res.json(homeData);
});
 */

app.post('/api/posts', async(req, res) => {
    const { username, password, admin} = req.body;
    const user = await User.findOne({username});
    if (user){
        console.log('Username already exists!');
        res.status(400).json({ error: 'Username already exists!'});
        return;
    }
    
    const newPost = { id: Date.now(), username, password, admin: false };
    temp = new User(newPost);
    await temp.save();
    res.status(201).json(newPost);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});