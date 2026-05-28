const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshToken, removeAllUserTokens, clearRefreshCookie, setRefreshCookie, findUserByRefreshToken } = require('../services/tokenService');

const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    clearRefreshCookie(res);

    const userId = await findUserByRefreshToken(refreshToken);

    // Detected refresh token reuse, we got a cookie but there was no user with that refresh token
    if (!userId) {
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, async (err, decoded) => {
            if (err) return res.sendStatus(403);
            console.log('attempted refresh token reuse');
            await removeAllUserTokens(decoded.id);
        });
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, async (err, user) => {
        if (err) {
            console.log('expired refresh token');
            const dec = jwt.decode(refreshToken);
            if (dec?.id) await removeRefreshToken(dec.id, refreshToken)
            return res.sendStatus(403);
        }

        if (userId !== user.id) {
            clearRefreshCookie(res);
            await removeRefreshToken(user.id, refreshToken);
            return res.sendStatus(403);
        }

        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);
        await storeRefreshTokens(newRefreshToken, user.id);
        await removeRefreshToken(user.id, refreshToken);
        clearRefreshCookie(res);
        setRefreshCookie(res, newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken
        });
    });
}

module.exports = refresh;