app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (key === 'email' || key === 'password') continue;

            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
    }
    next();
});