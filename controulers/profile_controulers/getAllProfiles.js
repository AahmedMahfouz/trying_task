const { UserProfile, User } = require('../../model/model_define'); 
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const getAllProfiles = asyncWrapper(async (req, res, next) => {
    const profiles = await UserProfile.findAll({
        include: [{
            model: User,
            attributes: ['user_id','fullname', 'email'] 
        }]
    }); 
    res.json({ status: httpStatusText.success, data: { profiles } });
});

module.exports=getAllProfiles