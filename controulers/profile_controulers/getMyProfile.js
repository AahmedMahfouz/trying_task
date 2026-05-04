const { UserProfile, User , WeightHistory} = require('../../model/model_define'); 
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

 res.json({ 
        status: httpStatusText.success, 
        data: { 
            account: {
                user_id: profile.user_id,
                fullName: profile.User.fullname,
                email: profile.User.email
            },   
            Profile: {
                profile_id: profile.profile_id,
                age: profile.age,
                gender: profile.gender,
                height: profile.height,
                initial_weight: profile.initial_weight,
                current_weight: profile.current_weight,
                target_weight: profile.target_weight,
                duration_days: profile.duration_days,
                active_level: profile.active_level,
                fitness_goal: profile.fitness_goal,
                experience_level: profile.experience_level,
                equipment: profile.equipment
            }
        } 
});
});

module.exports = getMyProfile;