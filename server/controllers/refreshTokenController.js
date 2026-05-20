const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshToken, showTokens, hasRefreshToken, removeAllUserTokens, clearRefreshCookie, setRefreshCookie, findUserByRefreshToken, findUser, refreshTokens } = require('../services/tokenService');

const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    clearRefreshCookie(res);

    const userId = findUserByRefreshToken(refreshToken);

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

    // removeRefreshToken(userId, refreshToken);

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
        if (userId !== user.id) {
            // clearRefreshCookie(res);
            removeRefreshToken(user.id, refreshToken);
            return res.sendStatus(403);
        }

        if (err) {
            console.log('expired refresh token');
            const dec = jwt.decode(refreshToken);
            if(dec?.id) removeRefreshToken(dec.id, refreshToken)
            // removeRefreshToken(user.id, refreshToken);
            showTokens();
            return res.sendStatus(403);
        }
        

        // Refresh token still valid
        // const tokenExists = hasRefreshToken(user.id, refreshToken);

        // // // sm tried to use the refresh token not the user
        // if(!tokenExists){
        //     removeAllUserTokens(user.id);
        //     return res.sendStatus(403);
        // }

        // // rotate token
        // removeRefreshTokens(user.id, refreshToken);
        // const tokenExists = await hasRefreshToken(user.id, refreshToken);

        // if (!tokenExists) {
        //     return res.sendStatus(403);
        // }

        removeRefreshToken(user.id, refreshToken);

        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);
        storeRefreshTokens(newRefreshToken, user.id);
        setRefreshCookie(res, newRefreshToken);
        showTokens();
        // if you want generate new refreshToken but first take it out of the db

        res.status(200).json({
            accessToken: newAccessToken,
            isAdmin: user.isAdmin
        });
    });
}

module.exports = refresh;