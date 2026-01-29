const rateLimit = require('express-rate-limit');
const appError = require('../helpers/appError');
const httpStatusText = require('../helpers/httpstatustext');

// request newCode 
const requestOtpLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    handler: (req, res, next) => {
        return next(appError.create("Too many OTP requests. Please try again later after 30 minutes.", 429, httpStatusText.fail));
    }
});

// check code 
const verifycodeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3, 
    handler: (req, res, next) => {
        return next(appError.create("Too many wrong attempts. Request a new code or wait 1 minute", 429, httpStatusText.fail));
    }
});

module.exports = {
    requestOtpLimiter,
    verifycodeLimiter
};