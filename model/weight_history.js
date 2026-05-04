const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

const WeightHistory = sequelize.define('weight_history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    recorded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { 
    timestamps: false,
    tableName: 'weight_histories' 
});

module.exports = WeightHistory;