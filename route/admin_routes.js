const express = require('express');
const router = express.Router();
const verifyToken = require('../midelware/verifytoken');
const allowedTo = require('../midelware/allowedTo');


const getAllUsers = require('../controulers/user_controulers/getAllUsers');
const getAllProfiles = require('../controulers/profile_controulers/getAllProfiles');
const { getStats } = require('../controulers/admin_controulers/getStats');
const { getUserDetailsForAdmin } = require('../controulers/admin_controulers/get_user_by_id.js');


// Get all users
router.get('/getalluser', verifyToken, allowedTo('admin'), getAllUsers);
// Get all profiles
router.get('/getAllprofile', verifyToken , allowedTo('admin'), getAllProfiles);
// admin can get all user information
router.get('/admin/getstats', verifyToken, allowedTo('admin'), getStats);
//admin get user informatio
router.get('/admin/user/:id', verifyToken, allowedTo('admin'), getUserDetailsForAdmin);