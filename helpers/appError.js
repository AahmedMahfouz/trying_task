class AppError extends Error {
    constructor() {
        super();
    }

    create(message, statusCode, statusText) {
        
        const error = new Error(message); 
        error.statusCode = statusCode;
        error.statusText = statusText;
        
        return error;
    }
}

module.exports = new AppError();