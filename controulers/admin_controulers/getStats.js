const { User, UserProfile } = require('../../model/model_define');
const { Sequelize } = require('sequelize');
const asyncWrapper = require('../../midelware/asyncWrapper');
const httpStatusText = require('../../helpers/httpstatustext');

const getStats = asyncWrapper(async (req, res, next) => {
    const totalUsers = await User.count();

    const goalDistribution = await UserProfile.findAll({
        attributes: [
            'fitness_goal',
            [Sequelize.fn('COUNT', Sequelize.col('fitness_goal')), 'count']
        ],
        group: ['fitness_goal']
    });

    const avgWeight = await UserProfile.findAll({
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('current_weight')), 'average_weight']
        ]
    });

    res.status(200).json({
        status: httpStatusText.success,
        data: {
            stats: {
                total_users: totalUsers,
                goals: goalDistribution,
                average_weight: parseFloat(avgWeight[0].dataValues.average_weight).toFixed(2)
            }
        }
    });
});

module.exports = {getStats};