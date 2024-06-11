const User = require('../models/User');
const { isValidToken } = require('../utils');
const customError = require('../errors');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new customError.UnauthenticatedError('Authentication Invalid`');
    }
    try {
        const { name, userId, role } = isValidToken({ token });
        req.user = { name, userId, role };
        next();
    } catch (error) {
        console.log(`🚀 ~ authenticateUser ~ error:`, error);
    }
};

const authorizeUser = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new customError.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeUser };
