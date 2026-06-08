const { User } = require("../../model/model_define");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');
const validateEmail = require('deep-email-validator').validate;

const register = asyncWrapper(async (req, res, next) => {
    if (!req.body || !req.body.password || !req.body.confirmPassword) {
        return next(appError.create("Please provide password and confirmPassword in the Request Body", 400, httpStatusText.fail));
    }

    const pass = req.body.password.trim();
    const confirmPass = req.body.confirmPassword.trim();
    
    if (pass !== confirmPass) {
        return next(appError.create("Passwords mismatch", 400, httpStatusText.fail));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pass)) {
        return next(appError.create(
            "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character", 
            400, 
            httpStatusText.fail
        ));
    }

    const oldUser = await User.findOne({ where: { email: req.body.email } });
    if (oldUser) return next(appError.create("Email already exists", 400, httpStatusText.fail));

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await User.create({
        fullname: req.body.fullname, 
        email: req.body.email, 
        password: hashedPassword,
        role: 'USER'
    });

    const token = jwt.sign(
        { email: newUser.email, id: newUser.user_id, role: newUser.role }, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' }
    );

    res.status(201).json({ status: httpStatusText.success, data: { user: newUser }, token });
});

module.exports = register;