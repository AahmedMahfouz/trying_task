const jwt = require('jsonwebtoken');
const appError = require('../helpers/appError');
const httpStatusText = require('../helpers/httpstatustext');

const verifyToken = (req, res, next) => {
    // 1. استقبال الـ Header اللي فيه التوكن
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    // 2. لو مفيش هيدر أصلاً
    if (!authHeader) {
        const error = appError.create("Token is required", 401, httpStatusText.fail);
        return next(error);
    }

    // 3. استخراج التوكن (الشكل بيكون: "Bearer TOKEN_CODE")
    const token = authHeader.split(' ')[1];

    try {
        // 4. فك تشفير التوكن والتأكد من صحته
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // 5. لو التوكن سليم، بنخزن بيانات المستخدم في الطلب عشان نستخدمها بعدين
        req.currentUser = decodedUser;
        
        // 6. عدي يا بطل (روح للدالة اللي بعدها)
        next();

    } catch (err) {
        const error = appError.create("Invalid or Expired Token", 401, httpStatusText.error);
        return next(error);
    }
}

module.exports = verifyToken;