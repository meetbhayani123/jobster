const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { attachCookiesToResponse } = require('../utils/index');
const customError = require('../errors');
const { createTokenUser } = require('../utils/');
const register = async (req, res) => {
    const { email, name, password } = req.body;

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customError.BadRequestError('Please provide email or password');
    }

    const user = await User.findOne({ email });
    if (!user) throw new customError.UnauthenticatedError('Invalid Credentials');

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) throw new customError.UnauthenticatedError('Invalid Credentials');

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
    register,
    login,
    logout,
};
