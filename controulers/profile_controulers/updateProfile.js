const { UserProfile, User } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const updateProfile = asyncWrapper(async (req, res, next) => {
    const { age, 
        gender, 
        height, 
        current_weight, 
        target_weight, 
        duration_days, 
        active_level, 
        fitness_goal, 
        experience_level, 
        equipment } = req.body;
    const currentUserId = req.currentUser.user_id || req.currentUser.id; 
    const profile = await UserProfile.findOne({ where: { user_id: currentUserId } });

    if (!profile) {
        return next(appError.create("Profile not found", 404, httpStatusText.fail));
    }

    await profile.update({
        age, 
        gender, 
        height, 
        current_weight, 
        target_weight, 
        duration_days, 
        active_level, 
        fitness_goal, 
        experience_level, 
        equipment
    });

    res.status(200).json({
        status: httpStatusText.success,
        data: { profile }
    });
});

module.exports=updateProfile