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
        return next(appError.create("there is no pofile to show progress", 404, httpStatusText.fail));
    }

    const totalLost = (profile.initial_weight - profile.current_weight).toFixed(2);

    res.status(200).json({
        status: httpStatusText.success,
        data: {
            logs: weightLogs,
            summary: {
                start_weight: profile.initial_weight,
                current_weight: profile.current_weight,
                target_weight: profile.target_weight,
                total_lost: totalLost
            }
        }
    });
});

module.exports = getUserProgress;