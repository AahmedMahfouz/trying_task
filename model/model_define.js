const User = require('./users_model');
const UserProfile = require('./user_profile_model');
const VerificationCode = require('./verification_code_model');
const WeightHistory = require('./weight_history.js');

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

UserProfile.hasMany(WeightHistory, { 
    foreignKey: 'user_id', 
    sourceKey: 'user_id', 
    as: 'weightLogs' 
});

WeightHistory.belongsTo(UserProfile, {
    foreignKey: 'user_id', 
    targetKey: 'user_id' 
});


module.exports = {
    User,
    UserProfile,
    VerificationCode,
    WeightHistory
};