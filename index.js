const express = require('express');
const cors = require("cors");
const com = require("compression");
require('dotenv').config();
const sequelize = require('./connection/db');
const users_router = require('./route/users.route');
const userprofile_router = require('./route/user_profile_route');

const app = express();

app.use(cors());
app.use(com());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Welcome to DietMinder API - Server is Live");
});

app.use('/api', users_router);
app.use('/api', userprofile_router);

// 404 Handler
app.all(/(.*)/, (req, res, next) => {
    res.status(404).json({ status: "Error", message: "This API is not available" });
});

// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || "Error",
        message: error.message || "Internal Server Error",
        data: null
    });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        await sequelize.sync({ alter: true }); 
        console.log('Tables updated/created successfully');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database Connection Error:', error);
    }
};

startServer();

module.exports = app;