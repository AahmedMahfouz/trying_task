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

// 1. مسار اختباري للتأكد أن السيرفر يعمل (يمنع 403 Forbidden)
app.get('/', (req, res) => {
    res.status(200).send("Welcome to DietMinder API - Server is Live and Connected");
});

// 2. تنظيم الروابط (تأكد من استخدام المسار الصحيح عند تجربة الـ API)
app.use('/api', users_router);
app.use('/api', userprofile_router);

// 404 Handler
app.all(/(.*)/, (req, res, next) => {
    res.status(404).json({ status: "Error", message: "This API path is not available" });
});

// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || "Error",
        message: error.message || "Internal Server Error",
        data: null
    });
});

// 3. تشغيل السيرفر مع تحديث قاعدة البيانات
const startServer = async () => {
    try {
        // التأكد من صحة الاتصال بالداتابيز
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // تحديث الهيكلية (إضافة عمود الـ role أو الجداول الجديدة)
        // اتركها مفعلة حالياً ليتم التحديث على Vercel
        await sequelize.sync({ alter: true }); 
        console.log('Database Tables Synced successfully');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        // هذا السطر مهم جداً لرؤية الخطأ الحقيقي في Vercel Logs
        process.exit(1); 
    }
};

startServer();

module.exports = app;