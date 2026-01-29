const { Sequelize } = require('sequelize');
const pg = require('pg');

// رجعنا للوضع الآمن: لو لايف خد من فيرسل، لو لوكل خد من الملف
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;