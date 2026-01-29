const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); 

const VerificationCode = sequelize.define('verification_codes', {
    code_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName:"verification_codes",
    timestamps: true 
});

module.exports = VerificationCode;