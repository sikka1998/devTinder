const express = require('express');
const userRouter = express.Router();
const { authUser } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');

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

userRouter.get('/feed', authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let limit = parseInt(req.query.limit) || 5;
        limit = limit > 50 ? 50 : limit;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;


        //Connect req and own profiles should be excluded from feed
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');

        const excludedUserIds = new Set();
        connectionRequests.forEach( request => {
            excludedUserIds.add(request.fromUserId.toString());
            excludedUserIds.add(request.toUserId.toString());
        })
        const feedUsers = await user.find({
            $or: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(excludedUserIds) } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            message: "Feed Users Fetched Successfully",
            data: feedUsers
        })
    } catch (err) {
        res.status(400).send("Error while fetching feed: " + err.message);
    }
})

module.exports = userRouter;