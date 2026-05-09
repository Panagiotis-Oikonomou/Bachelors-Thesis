const jwt = require('jsonwebtoken');
const { refreshTokens, generateAccessToken } = require('../services/tokenService');

const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    if(!refreshTokens.has(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json("Invalid refresh token");
        }
        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        // if you want generate new refreshToken but first take it out of the db

        res.status(200).json({
            accessToken: newAccessToken,
            isAdmin: user.isAdmin
        });
    });
}

module.exports = refresh;