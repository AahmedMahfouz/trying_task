const { User, VerificationCode } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');
const nodemailer = require('nodemailer');
const resetPassLimiter=require("../../authentication/password_auth.js")

const forgetPassword = asyncWrapper(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(appError.create("User not found", 404, httpStatusText.fail));
    
    // creat code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3* 60000);

    // store code in db
    await VerificationCode.create({
        user_id: user.user_id,
        code,
        expires_at: expiresAt
    });

    // send code on gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ahmedmahfouz3032004@gmail.com", 
            pass: "gzht qrsz nwid xqib"     
        }
    });
    
    //send code from my email to another mails
    const mailOptions = {
        from: '"Health App Support" ahmedmahfouz3032004@gmail.com',
        to: user.email, 
        subject: 'Password Reset Code',
        text: `Your verification code is: ${code}`
    };


 try {
        await transporter.sendMail(mailOptions);
        
        resetPassLimiter.verifycodeLimiter.resetKey(req.ip);
        res.status(200).json({ status: httpStatusText.success, msg: "Code send" });

    } catch (error) {
        return next(appError.create("Failed to send email", 500, httpStatusText.error));
    }
});

module.exports=forgetPassword