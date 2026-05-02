const express = require('express');
const cors = require("cors");
const com = require("compression");
require('dotenv').config();
const sequelize = require('./connection/db');
const users_router = require('./route/users.route');
const userprofile_router = require('./route/user_profile_route');

const app = express();

// Middlewares
app.use(cors());
app.use(com());
app.use(express.json());

// 1. مسار رئيسي (Home Route) للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.status(200).send("DietMinder API is Live and Connected");
});

// 2. تنظيم المسارات (تأكد من تجربة الروابط بـ /api)
app.use('/api', users_router);
app.use('/api', userprofile_router);

// 404 Handler
app.all(/(.*)/, (req, res, next) => {
    res.status(404).json({ status: "Error", message: "Path not found" });
});

// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || "Error",
        message: error.message || "Internal Server Error"
    });
});

// 3. تشغيل السيرفر مع المزامنة
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // السطر ده هو اللي هيضيف حقل الـ role وأي جداول جديدة
        await sequelize.sync({ alter: true }); 
        console.log('Database Tables Synced');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();

module.exports = app;