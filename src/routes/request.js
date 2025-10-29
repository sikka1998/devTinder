const express = require('express');
const requestRouter = express.Router();
const { authUser } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/send/:status/:toUserId', authUser, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(!['ignored', 'interested'].includes(status)){
            throw new Error("Invalid status type!");
        }

        const isToUserExist = await User.findById(toUserId);
        if(!isToUserExist){
            throw new Error("The user you are trying to connect with does not exist!");
        }

        const isAnyExistingConnection = await ConnectionRequest.findOne({ $or :[
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]});

        console.log(isAnyExistingConnection);

        if(isAnyExistingConnection){
            throw new Error("A connection request already exists between you and this user!");
        }

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await newConnectionRequest.save();

        res.json({
            message: `${req.user.firstName}, your connection request has been sent successfully to ${isToUserExist.firstName}`
        })
    } catch (err) {
        res.status(400).send("Error while sending connection request: " + err.message);
    }
});

requestRouter.post('/review/:status/:requestId', authUser, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUserId = req.user._id;

        const allowedStatus = ['accepted', 'rejected'];

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type for reviewing connection request!");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: "interested"
        })

        if(!connectionRequest) {
            throw new Error("No pending connection request found to review!");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        
        res.json({
            message: `Connection request has been ${status} successfully!`,
            data
        });
    } catch (err) {
        res.status(404).send("Error while reviewing connection request: " + err.message);
    }
})

module.exports = requestRouter;