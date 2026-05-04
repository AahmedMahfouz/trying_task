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
            },
            { 
                model: WeightHistory, 
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
            user,
            progressSummary: {
                totalLost,
                totalLogs: user.weight_histories ? user.weight_histories.length : 0
            }
        }
    });
});

module.exports = { getUserDetailsForAdmin };