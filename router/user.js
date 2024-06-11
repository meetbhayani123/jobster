const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showCurrentUser,
} = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

router.route('/').get(authenticateUser, authorizeUser('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
