const User = require('./users_model');
const UserProfile = require('./user_profile_model');
const VerificationCode = require('./verification_code_model');
// one user has one profile
User.hasOne(UserProfile, { 
    foreignKey: 'user_id', 
    onDelete: 'CASCADE',
    as: 'profile'
});
UserProfile.belongsTo(User, { 
    foreignKey: 'user_id' 
});
// one user has many code
User.hasMany(VerificationCode, { 
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});
VerificationCode.belongsTo(User, { 
    foreignKey: 'user_id' 
});

module.exports = {
    User,
    UserProfile,
    VerificationCode
};