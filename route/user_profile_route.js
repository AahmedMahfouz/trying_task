const express = require('express');
const router = express.Router();
const verifyToken = require('../midelware/verifytoken');

const creatProfile = require('../controulers/profile_controulers/createProfile');
const getMyProfile = require('../controulers/profile_controulers/getMyProfile');
const updateProfile = require('../controulers/profile_controulers/updateProfile');
const getAllProfiles = require('../controulers/profile_controulers/getAllProfiles');

router.post('/addProfile', verifyToken, creatProfile);

router.get('/getProfile', verifyToken, getMyProfile);

router.get('/getAllprofile', getAllProfiles);

router.patch('/updateProfile', verifyToken, updateProfile);

module.exports = router;