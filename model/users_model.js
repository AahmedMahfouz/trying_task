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
        allowNull: false,
        validate: {
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                msg: "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character (@$!%*?&)."
            }
        }
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
   underscored: true,        
    timestamps: true,         
    createdAt: 'created_at',  
    updatedAt: false
    
});

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;