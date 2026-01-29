const{User}=require("../../model/model_define")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const register = asyncWrapper(async (req, res, next) => {
    const { fullname, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) return next(appError.create("Passwords mismatch", 400, httpStatusText.fail));

    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) return next(appError.create("Email already exists", 400, httpStatusText.fail));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullname, email, password: hashedPassword
    });

    const token = jwt.sign({ email: newUser.email, id: newUser.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ status: httpStatusText.success, data: { user: newUser }, token });
});

module.exports= register