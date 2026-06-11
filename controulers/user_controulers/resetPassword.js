const { User, VerificationCode } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const bcrypt = require('bcryptjs');
const asyncWrapper = require('../../midelware/asyncWrapper');
const { Op } = require('sequelize');

const resetPassword = asyncWrapper(async (req, res, next) => {
    const { email, code, newPassword, confirmPassword } = req.body;
    
    if (!email || !code || !newPassword || !confirmPassword) {
        return next(appError.create("All fields are required", 400, httpStatusText.fail));
    }

    const pass = newPassword.trim();
    const confirmPass = confirmPassword.trim();

    if (pass !== confirmPass) {
        return next(appError.create("Passwords do not match", 400, httpStatusText.fail));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(pass)) {
        return next(appError.create(
            "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character", 
            400, 
            httpStatusText.fail
        ));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(appError.create("Data is not correct", 404, httpStatusText.fail));
    }
    
    const validCode = await VerificationCode.findOne({
        where: {
            user_id: user.user_id,
            code: code,
            is_used: false,
            expires_at: { [Op.gt]: new Date() }
        }
    });

    if (!validCode) {
        return next(appError.create("Invalid or expired code", 400, httpStatusText.fail));
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    user.password = hashedPassword;
    await user.save();

    validCode.is_used = true;
    await validCode.save();

    await VerificationCode.destroy({ 
        where: { 
            user_id: user.user_id, 
            code_id: { [Op.ne]: validCode.code_id }
        } 
    });

    res.status(200).json({ status: httpStatusText.success, msg: "Password updated successfully" });
});

module.exports = resetPassword;