const { User, UserProfile, WeightHistory } = require('../../model/model_define');
const asyncWrapper = require('../../midelware/asyncWrapper');
const appError = require('../../helpers/appError');
const httpStatusText = require('../../helpers/httpstatustext');

const getUserDetailsForAdmin = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }, 
        include: [
            {
                model: UserProfile,
                as: 'profile',
                attributes: { exclude: ['duration_days'] } 
            },
            { 
                model: WeightHistory,
                as: 'weightLogs' 
            }
        ],
        order: [[ { model: WeightHistory, as: 'weightLogs' }, 'recorded_at', 'DESC']]
    });

    if (!user) {
        return next(appError.create("User not found", 404, httpStatusText.fail));
    }

    res.status(200).json({
        status: httpStatusText.success,
        data: { 
            user,
            summary: {
                initialWeight: user.profile?.initial_weight || "Not set",
                currentWeight: user.profile?.current_weight || "Not set",
                targetWeight: user.profile?.target_weight || "Not set",
                totalWeightEntries: user.weightLogs ? user.weightLogs.length : 0
            }
        }
    });
});

module.exports = { getUserDetailsForAdmin };