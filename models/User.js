const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'please provide valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

userSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcryptjs.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);
