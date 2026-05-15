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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING, 
        allowNull: false
    },

   fitness_goal: {
        type: DataTypes.STRING,
        allowNull: false
    },

    experience_level: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    equipment: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true 
});

module.exports = UserProfile;