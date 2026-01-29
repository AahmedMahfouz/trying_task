const { User, UserProfile} = require('../../model/model_define'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

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

module.exports=login