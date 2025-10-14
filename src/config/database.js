const mongoose = require('mongoose');

const connectDB = async () => {
        await mongoose.connect("mongodb+srv://sikkander1998:October2025%40@travelbuddyai.uy2xg3r.mongodb.net/devTinder");
}

module.exports = connectDB;