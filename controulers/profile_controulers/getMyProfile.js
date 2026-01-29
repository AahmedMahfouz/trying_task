const { UserProfile, User } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const getMyProfile = asyncWrapper(async (req, res, next) => {
    const currentUserId = req.currentUser.id || req.currentUser.user_id;

    const profile = await UserProfile.findOne({ 
        where: { user_id: currentUserId },
        include: [{
            model: User, 
            attributes: ['user_id', 'fullname', 'email']
        }]
    }); 

    if (!profile) return next(appError.create("No profile found", 404, httpStatusText.fail));

    res.json({ status: httpStatusText.success, data: { profile } });
});

module.exports=getMyProfile