const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
app.use(express.json());

app.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.send("User created successfully!");
    } catch (err) {
        res.send("Error in creating user: ", err.message);
    }
})

app.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if(!user) {
            return res.status(404).send("User not found");
        }else {
            res.json(user);
        }
    } catch (err) {
        res.send("Something went wrong: ", err.message);
    }
})

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0) {
            return res.status(404).send("No users found");
        }else {
            res.json(users);
        }
    } catch (err) {
        res.send("Something went wrong: ", err.message);
    }
})

app.delete('/user', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        if(!user) {
            return res.status(404).send("User not found");
        }else {
            res.send("User deleted successfully");
        }
    } catch (err) {
        res.send("Something went wrong: ", err.message);
    }
})

app.patch('/user', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body.userId, req.body)
        if(!user) {
            return res.status(404).send("User not found");
        }else {
            res.send("User updated successfully");
        }
    } catch (err) {
        res.status(404).send("Something went wrong: ", err.message);
    }
})

// Connect to the database
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log('Server is successfully running on port 7777');
})
}).catch(err => {
    console.error("Database connection failed:", err);
});