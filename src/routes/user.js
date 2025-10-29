const express = require('express');
const userRouter = express.Router();
const { authUser } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/requests/received', authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName age skills photoURL')

        res.json({
            message: "Connection Requests Fetched Successfully",
            data: connectRequests
        })
    } catch(err) {
        res.status(400).send("Error while fetching received requests: " + err.message);
    } 
})

module.exports = userRouter;