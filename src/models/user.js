const { match } = require('assert');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minLength: [3, 'First name must be at least 3 characters long'],
        maxLength: [20, 'First name cannot exceed 20 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: [20, 'Last name cannot exceed 20 characters']
    },
    emailId: {
        type: String,
        trim: true,
        required: [true, 'Email ID is required'],
        unique: [true, 'Email ID must be unique'],
        minLength: [5, 'Email ID must be at least 5 characters long'],
        maxLength: [50, 'Email ID cannot exceed 50 characters']
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6,
        maxLength: 20,
        match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must contain at least one letter and one number']

    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: [80, 'Age cannot exceed 80'],
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: 'Gender must be Male, Female, or Other'
        }
    },
    skills: {
        type: [String],
    },
    photoURL: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps:  true });

module.exports = mongoose.model('User', userSchema);