const { User, UserProfile } = require('../../model/model_define');
const { Sequelize } = require('sequelize');
const asyncWrapper = require('../../midelware/asyncWrapper');
const httpStatusText = require('../../helpers/httpstatustext');

const getStats = asyncWrapper(async (req, res, next) => {
    // count user
    const totalUsers = await User.count();

    // distribution goal
    const goalDistribution = await UserProfile.findAll({
        attributes: [
            'fitness_goal',
            [Sequelize.fn('COUNT', Sequelize.col('fitness_goal')), 'count']
        ],
        group: ['fitness_goal']
    });

    // avgweightresult
    const avgWeightResult = await UserProfile.findAll({
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('current_weight')), 'average_weight']
        ],
        raw: true
    });

    const rawAvg = avgWeightResult[0]?.average_weight;
    const finalAvgWeight = rawAvg ? parseFloat(rawAvg).toFixed(2) : "0.00";

    res.status(200).json({
        status: httpStatusText.success,
        data: {
            stats: {
                total_users: totalUsers,
                goals: goalDistribution,
                average_weight: finalAvgWeight
            }
        }
    });
});

module.exports = { getStats };