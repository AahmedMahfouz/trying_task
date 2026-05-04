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
        },{
            model: WeightHistory,
            as: 'weightLogs',
            attributes: ['weight', 'recorded_at'],
            order: [['recorded_at', 'ASC']]
        }]
    }); 

    if (!profile) return next(appError.create("No profile found", 404, httpStatusText.fail));

    res.json({ status: httpStatusText.success, data: { profile } });
});

module.exports=getMyProfile