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
                as: 'profile'
            },
            { 
                model: WeightHistory,
                as: 'weightLogs', 
                order: [['recorded_at', 'ASC']] 
                        }
        ]
    });

    if (!user) {
        return next(appError.create("User not found", 404, httpStatusText.fail));
    }

    const initialWeight = user.user_profile?.initial_weight;
    const currentWeight = user.user_profile?.current_weight;
    const totalLost = (initialWeight && currentWeight) ? (initialWeight - currentWeight).toFixed(2) : 0;

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

module.exports = { getUserDetailsForAdmin };