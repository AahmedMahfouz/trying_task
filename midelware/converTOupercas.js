const convertToUpperCase = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (key === 'email' || key === 'password'|| key === 'confirmPassword') continue;

            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
    }
    next();
};

module.exports = convertToUpperCase;