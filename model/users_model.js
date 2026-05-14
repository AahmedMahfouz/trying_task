const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); 

const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        field:'name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Field must be a valid email" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'USER',
        allowNull: false
    },
    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
    }
}, {
    tableName: 'users',
   timestamps: true
    
});

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;