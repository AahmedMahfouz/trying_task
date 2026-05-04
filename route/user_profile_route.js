const express = require('express');
const router = express.Router();
const verifyToken = require('../midelware/verifytoken');


const creatProfile = require('../controulers/profile_controulers/createProfile');
const getMyProfile = require('../controulers/profile_controulers/getMyProfile');
const updateProfile = require('../controulers/profile_controulers/updateProfile');
const getWeightProgress = require('../controulers/profile_controulers/getmyprogress');


router.post('/addProfile', verifyToken, creatProfile);

router.get('/getProfile', verifyToken, getMyProfile);

router.patch('/updateProfile', verifyToken, updateProfile);

router.get('/my-progress', verifyToken, getWeightProgress);

module.exports = router;