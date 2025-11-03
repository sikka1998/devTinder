const express = require('express');
const userRouter = express.Router();
const { authUser } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName age skills photoURL';

userRouter.get('/requests/received', authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA)

        res.json({
            message: "Connection Requests Fetched Successfully",
            data: connectRequests
        })
    } catch(err) {
        res.status(400).send("Error while fetching received requests: " + err.message);
    } 
})

userRouter.get('/connections', authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', USER_SAFE_DATA);

        const data = connectionRequests.map( request => {
            if(request.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return request.toUserId;
            }

            return request.fromUserId;
        })

        res.json({
            message: "Connections Fetched Successfully",
            data: data
        })
    } catch(err) {
        res.status(400).send("Error while fetching connections: " + err.message);
    }
})

module.exports = userRouter;