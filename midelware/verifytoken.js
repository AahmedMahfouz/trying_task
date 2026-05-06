const jwt = require('jsonwebtoken');
const appError = require('../helpers/appError');
const httpStatusText = require('../helpers/httpstatustext');
const { BlacklistedToken } = require('../model/model_define'); 

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if (!authHeader) {
        return next(appError.create("Token is required", 401, httpStatusText.fail));
    }

    const token = authHeader.split(' ')[1];

    try {
        
        const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
        if (isBlacklisted) {
            return next(appError.create("Token is invalidated (Logged out)", 401, httpStatusText.fail));
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.currentUser = {
            user_id: decodedUser.id || decodedUser.user_id,
            email: decodedUser.email,
            role: decodedUser.role,
            exp: decodedUser.exp 
        };
        
        next();

    } catch (err) {
        const error = appError.create("Invalid or Expired Token", 401, httpStatusText.error);
        return next(error);
    }
}

module.exports = verifyToken;