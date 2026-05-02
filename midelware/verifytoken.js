const jwt = require('jsonwebtoken');
const appError = require('../helpers/appError');
const httpStatusText = require('../helpers/httpstatustext');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if (!authHeader) {
        const error = appError.create("Token is required", 401, httpStatusText.fail);
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.currentUser = {
            user_id: decodedUser.id || decodedUser.user_id,
            email: decodedUser.email,
            role: decodedUser.role
        };
        
        next();

    } catch (err) {
        const error = appError.create("Invalid or Expired Token", 401, httpStatusText.error);
        return next(error);
    }
}

module.exports = verifyToken;