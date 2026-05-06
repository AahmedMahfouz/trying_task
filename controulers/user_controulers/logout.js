const { BlacklistedToken } = require('../../model/model_define');
const asyncWrapper = require('../../midelware/asyncWrapper');
const httpStatusText = require('../../helpers/httpstatustext');

const logout = asyncWrapper(async (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    const expiryDate = new Date(req.currentUser.exp * 1000);

    await BlacklistedToken.create({
        token: token,
        expiresAt: expiryDate
    });

    res.status(200).json({ 
        status: httpStatusText.success, 
        message: "Logged out successfully" 
    });
});

module.exports = logout;