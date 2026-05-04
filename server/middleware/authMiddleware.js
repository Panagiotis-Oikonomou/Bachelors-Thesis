const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
    // const authHeader = req.headers.authorization;
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
            // the user here contains the payload
            if (err) return res.status(403).json("Token is not valid");

            req.user = user;
            next();

        });
    }
    else res.status(401).json("You are not Authenticated");
}