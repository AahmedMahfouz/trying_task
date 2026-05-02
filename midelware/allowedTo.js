const appError = require("../helpers/appError");
const httpStatusText = require("../helpers/httpstatustext");

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create("This role is not authorized to access this route", 403, httpStatusText.fail));
        }
        next();
    }
}