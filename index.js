const express = require('express');
const cors = require("cors");
const com =require("compression")
require('dotenv').config();
const sequelize = require('./connection/db');
const users_router = require('./route/users.route');
const userprofile_router = require('./route/user_profile_route');

const app = express();

app.use(cors());
app.use(com());
app.use(express.json());

// Routes
app.use('/', users_router);
app.use('/', userprofile_router);

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
        console.log('Database connected && server started');

        // use to creat db if there isn't
        // await sequelize.sync({ alter: true }); 
        // console.log('Tables created successfully');
        
        //use to clear db
        // await sequelize.sync({ force: true }); 
        // console.log('All tables re-created successfully');

        app.listen(process.env.PORT || 5000, () => {
            console.log(`server listen on port ${process.env.PORT}`);
            
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

startServer();
//
module.exports=app;