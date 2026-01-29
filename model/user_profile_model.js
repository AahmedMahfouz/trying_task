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
        type: DataTypes.FLOAT,
        allowNull: false 
    },
    gender: { 
        type: DataTypes.ENUM('Male','Female'),
        allowNull: false 
    },
    height: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    weight: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    activeLevel: {
        type: DataTypes.ENUM('High','Moderate','Low'), 
        allowNull: true
    },
    goal: { 
        type: DataTypes.ENUM('Lose Weight', 'Gain Muscle', 'Maintain Weight'),
        allowNull: false
    },
    dietary: {
        type: DataTypes.ENUM('Vegetarian','Non-Vegetarian','Vegan','Keto','Mediterranean'), 
        allowNull: false
    },
    allergies: { 
        type: DataTypes.STRING, 
        defaultValue: "None" 
    },
},
{
    tableName: 'user_profiles',
    
});

module.exports = UserProfile;