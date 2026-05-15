const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const UserProfile = sequelize.define('user_profile', {
    profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    age: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    gender: { 
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false 
    },

    height: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },

    current_weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },

     initial_weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },

    target_weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    bmi: { 
        type: DataTypes.FLOAT, 
        allowNull: true,
    },
    bmr: { 
        type: DataTypes.FLOAT, 
        allowNull: true,
    },
    
    active_level: {
        type: DataTypes.ENUM('sedentary', 'light', 'moderate', 'active', 'very active'), 
        allowNull: false
    },

   fitness_goal: {
        type: DataTypes.ENUM('lose_weight', 'bodybuilding', 'powerlifting', 'athletics'),
        allowNull: false
    },

    experience_level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
    },

    equipment: {
        type: DataTypes.ENUM('Full Gym', 'at home', 'garage Gym'),
        allowNull: false,
    }
},
{
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true 
});

module.exports = UserProfile;