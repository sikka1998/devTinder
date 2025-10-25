const express = require('express');
const profileRouter = express.Router();
const { authUser } = require('../middlewares/auth')
const { validationOnProfileEdit } = require('../helper/helper');

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

module.exports = profileRouter;