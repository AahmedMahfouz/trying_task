const { WeightHistory, UserProfile } = require('../../model/model_define');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');

const getUserProgress = asyncWrapper(async (req, res, next) => {
    const currentUserId = req.currentUser.user_id || req.currentUser.id;

    const weightLogs = await WeightHistory.findAll({
        where: { user_id: currentUserId },
        attributes: ['weight', 'recorded_at'],
        order: [['recorded_at', 'ASC']] 
    });

    const profile = await UserProfile.findOne({
        where: { user_id: currentUserId },
        attributes: ['initial_weight', 'current_weight', 'target_weight']
    });

    if (!profile) {
        return next(appError.create("No profile found", 404, httpStatusText.fail));
    }

    res.status(200).json({
        status: httpStatusText.success,
        data: {
            chartData: weightLogs,
            summary: {
                started_at: profile.initial_weight,
                currently_at: profile.current_weight,
                aiming_for: profile.target_weight
            }
        }
    });
});

module.exports = getUserProgress;