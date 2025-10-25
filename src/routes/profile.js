const express = require('express');
const profileRouter = express.Router();
const { authUser } = require('../middlewares/auth')

profileRouter.get('/profile', authUser, (req, res) => {
        const user = req.user;
        res.send({
            "message": "User Profile Fetched Successfully",
            "data": user
        });
})

module.exports = profileRouter;