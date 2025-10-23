const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authUser = async (req, res, next) => {
    try {
    const { authToken } = req.cookies;
    if(!authToken) {
        throw new Error("Authentication token missing");
    }
    const decodedObj = jwt.verify(authToken, 'devTinder@7777');
    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if(!user) {
        throw new Error("User not found");
    }
    req.user = user;
    next();
} catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
}
}

module.exports = {
    authUser
}