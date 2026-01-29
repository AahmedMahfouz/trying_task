const express = require('express');
const router = express.Router();
const resetPassLimiter=require("../authentication/password_auth.js")

const getAllUsers = require('../controulers/user_controulers/getAllUsers');
const register = require('../controulers/user_controulers/register');
const login = require('../controulers/user_controulers/login');
const forgetPassword = require('../controulers/user_controulers/forgetPassword');
const resetPassword = require('../controulers/user_controulers/resetPassword');

// Get all users
router.get('/',getAllUsers);

// Register (Signup)
router.post('/register',register);

// Login
router.post('/login',login);

// Forget Password
router.post('/forget-password',resetPassLimiter.requestOtpLimiter,forgetPassword);

// reset password
router.post('/reset-password', resetPassLimiter.verifycodeLimiter,resetPassword);

module.exports = router;