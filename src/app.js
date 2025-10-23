const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validationOnSignUp } = require('./helper/helper');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { authUser } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = validationOnSignUp(req);
        await bcrypt.hash(password, 10).then(async (hashedPassword) => {
            console.log("Fields", firstName, lastName, emailId, hashedPassword);
            const newUser = new User({
                firstName,
                lastName,
                emailId,
                password: hashedPassword
            });
            await newUser.save();
        });
        res.send("User created successfully!");
    } catch (error) {
        res.send("Error in creating user: ", error);
    }
})

app.post('/login', async (req, res) => {
    try {
        const {emailId, password } = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("Invalid email format");
        }
        const user = await User.findOne({ emailId });
        if(!user) {
            throw new Error("Invalid Login Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new Error("Invalid Login Credentials");
        }

        const token = jwt.sign({ userId: user._id }, 'devTinder@7777', { expiresIn: '7d' });

        res.cookie('authToken', token, {expires: new Date(Date.now() + 7*24*60*60*1000)});
        res.send("User logged in successfully!");
    } catch (err) {
        res.status(400).send("Error while logging in: " + err.message);
    }
})

app.get('/profile', authUser, (req, res) => {
        const user = req.user;
        res.send({
            "message": "User Profile Fetched Successfully",
            "data": user
        });
})

app.post('/sendConnectionRequest', authUser, async (req, res) => {
    console.log("Authenticated User: ", req.user);
    console.log("Sending Connection Request");
    res.send({
        "message": "Connection Request Sent Successfully"
    });
});

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

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["age", "skills", "photoURL", "gender"];
        const isUpdateValid = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
        if(!isUpdateValid) {
            return res.status(400).send("Invalid updates!");
        }
        if(data?.age && (data.age < 18 || data.age > 80)) {
            return res.status(400).send("Age must be between 18 and 80");
        }
        if(data?.skills && !Array.isArray(data.skills)) {
            return res.status(400).send("Skills must be an array of strings");
        }
        if(data?.skills.length > 12){
            return res.status(400).send("Skills cannot exceed 12 items");
        }
        if(data?.photoURL && typeof data.photoURL !== 'string') {
            return res.status(400).send("photoURL must be a string");
        }
        if(data?.gender && !['Male', 'Female', 'Other'].includes(data.gender)) {
            return res.status(400).send("Gender must be Male, Female, or Other");
        }

        const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        if(!user) {
            return res.status(404).send("User not found");
        }else {
            res.send("User updated successfully", user);
        }
    } catch (err) {
        res.status(404).send("Error while Updating User: ", err.message);
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