const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: "Suriya",
        lastName: "Kala",
        emailId: "suriya.kala@gmail.com",
        password: "abcd1234",
        age: 26,
        gender: "Female"
    }
    try {
        const newUser = new User(userObj);
        await newUser.save();
        res.send("User created successfully!");
    } catch (err) {
        res.send("Error in creating user: ", err.message);
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