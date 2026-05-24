const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshToken, showTokens, hasRefreshToken, removeAllUserTokens, clearRefreshCookie, setRefreshCookie, findUserByRefreshToken, findUser, refreshTokens } = require('../services/tokenService');

const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    clearRefreshCookie(res);

    const userId = findUserByRefreshToken(refreshToken);
    console.log('cookie token:', refreshToken);
    showTokens();
    console.log('found userId:', userId);

    // Detected refresh token reuse, we got a cookie but there was no user with that refresh token
    if (!userId) {
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, async (err, decoded) => {
            if (err) return res.sendStatus(403);
            console.log('attempted refresh token reuse');
            removeAllUserTokens(decoded.id);
            showTokens();
        });
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
        if (err) {
            console.log('expired refresh token');
            const dec = jwt.decode(refreshToken);
            if (dec?.id) removeRefreshToken(dec.id, refreshToken)
            showTokens();
            return res.sendStatus(403);
        }

        if (userId !== user.id) {
            clearRefreshCookie(res);
            removeRefreshToken(user.id, refreshToken);
            return res.sendStatus(403);
        }

        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);
        storeRefreshTokens(newRefreshToken, user.id);
        removeRefreshToken(user.id, refreshToken);
        clearRefreshCookie(res);
        setRefreshCookie(res, newRefreshToken);
        showTokens();

        res.status(200).json({
            accessToken: newAccessToken
        });
    });
}

module.exports = refresh;