const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);
app.use('/user', profileRouter);
app.use('/request', requestRouter);
app.use('/users', userRouter);

// Connect to the database
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log('Server is successfully running on port 7777');
})
}).catch(err => {
    console.error("Database connection failed:", err);
});