const { User, UserProfile, VerificationCode } = require('../model/model_define'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appError = require('../helpers/appError');
const httpStatusText = require('../helpers/httpstatustext');
const asyncWrapper = require('../midelware/asyncWrapper');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const resetPassLimiter=require("../authentication/reset_password_auth")
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

// 2. Login (زي ما هو)
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(appError.create("Required fields", 400, httpStatusText.fail));

    const user = await User.findOne({ where: { email } });
    if (!user) return next(appError.create("User not found", 401, httpStatusText.fail));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(appError.create("Wrong password", 401, httpStatusText.fail));

    const token = jwt.sign({ email: user.email, id: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    
    const profile = await UserProfile.findOne({ where: { user_id: user.user_id } });

    res.status(200).json({
        status: httpStatusText.success,
        token,
        data: { user, hasProfile: !!profile }
    });
});

// 3. Forget Password (إرسال كود للإيميل)
const forgetPassword = asyncWrapper(async (req, res, next) => {
    const { email } = req.body; // بنستقبل الإيميل بس
    const user = await User.findOne({ where: { email } });
    if (!user) return next(appError.create("User not found", 404, httpStatusText.fail));

    // إنشاء كود 4 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3* 60000);

    // حفظ الكود في الداتابيز
    await VerificationCode.create({
        user_id: user.user_id,
        code,
        expires_at: expiresAt
    });
//

    // إعدادات الإرسال (Gmail)
    // إعدادات الإرسال (Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // ⚠️ استبدل هذا بإيميلك الحقيقي
            user: "ahmedmahfouz3032004@gmail.com", 
            
            // ⚠️ استبدل هذا بالـ App Password الـ 16 حرف اللي نسخته (من غير مسافات)
            // ❌ لا تضع باسورد الإيميل العادي هنا
            pass: "gzht qrsz nwid xqib"     
        }
    });

    const mailOptions = {
        from: '"Health App Support" <ahmed.example@gmail.com>', // يفضل نفس الإيميل اللي فوق
        to: user.email, 
        subject: 'Password Reset Code',
        text: `Your verification code is: ${code}`
    };


 try {
        await transporter.sendMail(mailOptions);
        
        // 🔥🔥 الإضافة المطلوبة: تصفير عداد المحاولات الخاطئة 🔥🔥
        // بمجرد إرسال كود جديد، نمسح البلوك عن الـ IP ده
        resetPassLimiter.verifycodeLimiter.resetKey(req.ip);

        console.log(`📧 Email sent to ${email}`);
        res.status(200).json({ status: httpStatusText.success, msg: "Code send" });

    } catch (error) {
        console.error("Email Error:", error);
        return next(appError.create("Failed to send email", 500, httpStatusText.error));
    }
});

// 4. Reset Password (التحقق وتغيير الباسورد)
// controulers_users.js

const resetPassword = asyncWrapper(async (req, res, next) => {
    const { email, code, newPassword, confirmPassword } = req.body;

    // 1. التحقق من المدخلات
    if (!email || !code || !newPassword || !confirmPassword) {
        return next(appError.create("All fields are required", 400, httpStatusText.fail));
    }

    if (newPassword !== confirmPassword) {
        return next(appError.create("Passwords do not match", 400, httpStatusText.fail));
    }

    // 2. البحث عن المستخدم
    const user = await User.findOne({ where: { email } });
    if (!user) {
        // أمان إضافي: لا تخبر الهاكر أن الإيميل غير موجود، بل قل "بيانات غير صحيحة" بشكل عام
        // لكن للتبسيط حالياً سنتركها User not found
        return next(appError.create("User not found", 404, httpStatusText.fail));
    }

    // 3. التحقق من الكود (المنطق الأمني)
    const validCode = await VerificationCode.findOne({
        where: {
            user_id: user.user_id,
            code: code,
            is_used: false, // لازم يكون مش مستخدم قبل كدة
            expires_at: { [Op.gt]: new Date() } // لازم تاريخ الانتهاء يكون لسه مجاش (أكبر من دلوقت)
        }
    });

    if (!validCode) {
        return next(appError.create("Invalid or expired code", 400, httpStatusText.fail));
    }

    // 4. تشفير وحفظ الباسورد الجديد
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // 5. حرق الكود (أهم خطوة)
    validCode.is_used = true;
    await validCode.save();

    // (اختياري) أمان إضافي: احذف كل الأكواد القديمة لهذا المستخدم لتنظيف الداتابيز
    await VerificationCode.destroy({ 
        where: { 
            user_id: user.user_id, 
            code_id: { [Op.ne]: validCode.code_id } // امسح كله ما عدا الحالي (لأنه already تسجل used)
        } 
    });

    res.status(200).json({ status: httpStatusText.success, msg: "Password updated successfully" });
});

// Get All Users
const getAllUsers = asyncWrapper(async (req, res, next) => {
    const users = await User.findAll(); 
    res.json({ status: httpStatusText.success, data: { users } });
});

module.exports = { register, login, forgetPassword, resetPassword, getAllUsers };