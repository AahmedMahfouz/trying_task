const convertToUpperCase = (req, res, next) => {
    if (req.body) {
        const protectedKeys = ['email', 'password', 'confirmPassword'];

        for (let key in req.body) {
            if (protectedKeys.includes(key)) continue;

            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
    }
    next();
};

module.exports = convertToUpperCase;