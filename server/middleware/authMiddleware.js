const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        // the user here contains the payload id, isAdmin
        if (err) return res.status(403).json("Token is not valid");

        req.user = user;
        next();

    });
}