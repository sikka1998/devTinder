const express = require('express');
const requestRouter = express.Router();
const { authUser } = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', authUser, async (req, res) => {
    console.log("Authenticated User: ", req.user);
    console.log("Sending Connection Request");
    res.send({
        "message": "Connection Request Sent Successfully"
    });
});

module.exports = requestRouter;