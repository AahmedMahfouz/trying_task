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
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false 
    },

    height: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    target_weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    initial_weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    duration_days: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
    },

    goal: { 
        type: DataTypes.ENUM('Lose Weight', 'Body Building', 'Power Lifiting' , 'Athletics'),
        allowNull: false
    },
    active_level: {
        type: DataTypes.ENUM('Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'), 
        allowNull: false
    },
    experience_level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
    },
    equipment: {
        type: DataTypes.ENUM('Full Gym', 'Home Gym', 'Garage Gym'),
        allowNull: false,
    }
},
{
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true 
});

module.exports = UserProfile;