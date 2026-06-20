const jwt = require('jsonwebtoken');
const { removeRefreshToken, hasRefreshToken, clearRefreshCookie } = require('../services/tokenService');

exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, async (err, decoded) => {
        if (!err) {
            const exists = await hasRefreshToken(decoded.id, refreshToken);
            
            if (exists) await removeRefreshToken(decoded.id, refreshToken);
        }
    });

    clearRefreshCookie(res);
    return res.sendStatus(204);
}