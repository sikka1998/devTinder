const validator = require('validator');

const validationOnSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !emailId || !password) {
        throw new Error('First Name, Email ID and Password are required fields');
    }
    if(!validator.isEmail(emailId)) {
        throw new Error('Invalid email format');
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error('Enter a Strong Password');
    }
    if(firstName.length < 3 || firstName.length > 20) {
        throw new Error('First name must be between 3 and 20 characters long');
    }
    if(lastName && (lastName.length > 20)) {
        throw new Error('Last name cannot exceed 20 characters');
    }
    if((firstName && !validator.isAlpha(firstName.trim())) || (lastName && !validator.isAlpha(lastName.trim()))) {
        throw new Error('First name and last name must contain only alphabetic characters');
    }

    return {
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : undefined,
        emailId: emailId.trim(),
        password: password.trim()
    }
}

const validationOnProfileEdit = (req) => {
    const ALLOWED_UPDATES = ['firstName', 'lastName', 'bio', "age", "gender", "skills", "photoURL"];
    const isEditValid = Object.keys(req.body).every((update) => ALLOWED_UPDATES.includes(update));

    return isEditValid;
}

module.exports = {
    validationOnSignUp,
    validationOnProfileEdit
}