const express = require('express');
const router = express.Router();
const resetPassLimiter=require("../authentication/password_auth.js")
const { getStats } = require('../controulers/admin_controulers/getStats');
const { getUserDetailsForAdmin } = require('../controulers/admin_controulers/get_user_by_id.js/index.js');
const verifyToken = require('../midelware/verifytoken');
const allowedTo = require('../midelware/allowedTo');

const getAllUsers = require('../controulers/user_controulers/getAllUsers');
const register = require('../controulers/user_controulers/register');
const login = require('../controulers/user_controulers/login');
const forgetPassword = require('../controulers/user_controulers/forgetPassword');
const resetPassword = require('../controulers/user_controulers/resetPassword');

// Get all users
router.get('/', verifyToken, allowedTo('admin'), getAllUsers);
// admin can get all user information
router.get('/admin/stats', verifyToken, allowedTo('admin'), getStats);

//admin get user informatio
router.get('/admin/user/:id', verifyToken, allowedTo('admin'), getUserDetailsForAdmin);

// Register (Signup)
router.post('/register',register);

// Login
router.post('/login',login);

// Forget Password
router.post('/forget-password',resetPassLimiter.requestOtpLimiter,forgetPassword);

// reset password
router.post('/reset-password', resetPassLimiter.verifycodeLimiter,resetPassword);

module.exports = router;