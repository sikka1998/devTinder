const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minLength: [3, 'First name must be at least 3 characters long'],
        maxLength: [20, 'First name cannot exceed 20 characters']
    },
    lastName: {
        type: String || undefined,
        trim: true,
        maxLength: [20, 'Last name cannot exceed 20 characters']
    },
    emailId: {
        type: String,
        trim: true,
        required: [true, 'Email ID is required'],
        unique: [true, 'Email ID must be unique'],
        minLength: [5, 'Email ID must be at least 5 characters long'],
        maxLength: [50, 'Email ID cannot exceed 50 characters'],
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6,
        maxLength: 64,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Enter a Strong Password');
            }
        }

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
        default: '',
        validate(value) {
            if(value && !validator.isURL(value)) {
                throw new Error('Invalid URL format for photoURL');
            }
        }
    }
}, { timestamps:  true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ userId: user._id }, 'devTinder@7777', { expiresIn: '7d' });
    return token;
}

userSchema.methods.verifyPassword = async function(userInputPassword) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);