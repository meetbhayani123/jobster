const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

const getAllUsers = async (req, res) => {
    const user = await User.find({ role: 'user' });
    res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');

    if (!user) {
        throw new customError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new customError.BadRequestError('Please provide all values');
    }
    const user = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { email, name },
        { new: true, runValidators: true }
    );
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new customError.BadRequestError('Please provide both values');
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new customError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};
