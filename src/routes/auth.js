const express = require('express');
const authRouter = express.Router();
const { validationOnSignUp } = require('../helper/helper');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = validationOnSignUp(req);
        await bcrypt.hash(password, 10).then(async (hashedPassword) => {
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
        res.send("Error in creating user: " + error.message);
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("Invalid email format");
        }
        const user = await User.findOne({ emailId });
        if(!user) {
            throw new Error("Invalid Login Credentials");
        }
        const isPasswordValid = await user.verifyPassword(password);
        if(!isPasswordValid) {
            throw new Error("Invalid Login Credentials");
        }

        const token = await user.getJWT();

        res.cookie('authToken', token, {expires: new Date(Date.now() + 7*24*60*60*1000)});
        res.send("User logged in successfully!");
    } catch (err) {
        res.status(400).send("Error while logging in: " + err.message);
    }
})

module.exports = authRouter;