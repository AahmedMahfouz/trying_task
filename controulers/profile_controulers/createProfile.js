const { UserProfile, User } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const createProfile = asyncWrapper(async (req, res, next) => {
    const {
        age, 
        gender, 
        height, 
        current_weight, 
        target_weight,  
        active_level, 
        fitness_goal, 
        experience_level, 
        equipment } = req.body;
    const currentUserId = req.currentUser.id || req.currentUser.user_id; 
    const userExists = await User.findByPk(currentUserId);
    
    if (!userExists) return next(appError.create("User not found", 404, httpStatusText.fail));
    
    const existingProfile = await UserProfile.findOne({ where: { user_id: currentUserId } });
    if(existingProfile) return next(appError.create("Profile exists", 400, httpStatusText.fail));



    const newProfile = await UserProfile.create({
      user_id: currentUserId,
        age, 
        gender, 
        height, 
        current_weight, 
        initial_weight:current_weight, 
        target_weight, 
        active_level, 
        fitness_goal, 
        experience_level, 
        equipment
    });

    res.status(201).json({
        status: httpStatusText.success,
        data: { profile: newProfile }
    });
});

module.exports=createProfile