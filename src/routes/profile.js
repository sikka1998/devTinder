const express = require('express');
const profileRouter = express.Router();
const { authUser } = require('../middlewares/auth')
const { validationOnProfileEdit, validationOnPasswordChange } = require('../helper/helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

profileRouter.get('/profile/view', authUser, (req, res) => {
        const user = req.user;
        res.send({
            "message": "User Profile Fetched Successfully",
            "data": user
        });
})

profileRouter.patch('/profile/edit', authUser, async(req, res) => {
    try{
        if(!validationOnProfileEdit(req)){
            throw new Error("Invalid Profile Data");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        
        res.send({
            "message": "Profile Updated Successfully",
            "data": loggedInUser
        });
    } catch (err) {
        res.status(400).send("Error while updating profile: " + err.message);
    }
});

profileRouter.post('/password/change', async (req, res) => {
    try {
        const { emailId, newPassword } = validationOnPasswordChange(req);
        console.log(emailId, newPassword);
        const user = await User.findOne({ emailId: emailId });
        if(!user) {
            throw new Error("Unauthorized Password Change Attempt");
        }
        
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();

        res.json({
            "message": "Password Changed Successfully"
        })
    } catch (err) {
        res.status(400).send("Error while changing password: " + err.message);
    }
});

module.exports = profileRouter;