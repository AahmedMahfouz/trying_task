const { User } = require("../../model/model_define");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');
const { validate: validateEmail } = require('deep-email-validator');

const register = asyncWrapper(async (req, res, next) => {
    if (!req.body || !req.body.password || !req.body.confirmPassword || !req.body.email) {
        return next(appError.create("Please provide email, password and confirmPassword in the Request Body", 400, httpStatusText.fail));
    }

    const emailInput = req.body.email.trim();
    const pass = req.body.password.trim();
    const confirmPass = req.body.confirmPassword.trim();
    
    if (pass !== confirmPass) {
        return next(appError.create("Passwords mismatch", 400, httpStatusText.fail));
    }

    const emailRes = await validateEmail({
        email: emailInput,
        validateRegex: true,
        validateMx: true,           
        validateSmtp: true,         
        validateDisposable: true  
    });

    if (!emailRes.valid) {
        return next(appError.create(
            "This email is invalid or does not exist on Gmail servers. Please enter a real email.", 
            400, 
            httpStatusText.fail
        ));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pass)) {
        return next(appError.create(
            "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character", 
            400, 
            httpStatusText.fail
        ));
    }

    const oldUser = await User.findOne({ where: { email: emailInput } });
    if (oldUser) return next(appError.create("Email already exists", 400, httpStatusText.fail));

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await User.create({
        fullname: req.body.fullname, 
        email: emailInput, 
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