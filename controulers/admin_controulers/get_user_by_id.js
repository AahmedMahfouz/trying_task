const { User, UserProfile } = require('../../model/model_define');
const asyncWrapper = require('../../midelware/asyncWrapper');

const getUserDetailsForAdmin = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: UserProfile,
                as: 'profile'
            }
        ]
    });

    if (!user) {
        return res.status(404).json({
            status: "Error",
            message: "User not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: { user }
    });
});

module.exports = { getUserDetailsForAdmin };