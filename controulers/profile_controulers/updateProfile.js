const { UserProfile, User, WeightHistory } = require('../../model/model_define'); // تأكد من استيراد WeightHistory
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const updateProfile = asyncWrapper(async (req, res, next) => {
    const {
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
    } = req.body;

    const currentUserId = req.currentUser.user_id || req.currentUser.id; 
    const profile = await UserProfile.findOne({ where: { user_id: currentUserId } });

    if (!profile) {
        return next(appError.create("Profile not found", 404, httpStatusText.fail));
    }
    const today = new Date().toISOString().split('T')[0];
    
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
        equipment,
        recorded_at: today
    });

    if (current_weight) {
        await WeightHistory.create({
            weight: current_weight,
            user_id: currentUserId,
            recorded_at: new Date()
        });
    }

    res.status(200).json({
        status: httpStatusText.success,
        data: { 
            profile,
            message: "Profile updated and weight logged in history" 
        }
    });
});

module.exports = updateProfile;