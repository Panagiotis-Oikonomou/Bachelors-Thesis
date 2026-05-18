const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshTokens, showTokens, hasRefreshToken, removeAllUserTokens } = require('../services/tokenService');

const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false });

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, async (err, user) => {
        if (err) {
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false});
            return res.status(403).json("Invalid refresh token");
        }
        // const tokenExists = hasRefreshToken(user.id, refreshToken);

        // // // sm tried to use the refresh token not the user
        // if(!tokenExists){
        //     removeAllUserTokens(user.id);
        //     return res.sendStatus(403);
        // }

        // // rotate token
        // removeRefreshTokens(user.id, refreshToken);
        const tokenExists = await hasRefreshToken(user.id, refreshToken);

        if (!tokenExists) {
            return res.sendStatus(403);
        }

        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        // const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);
        // storeRefreshTokens(newRefreshToken, user.id);
        // res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        // if you want generate new refreshToken but first take it out of the db

        res.status(200).json({
            accessToken: newAccessToken,
            isAdmin: user.isAdmin
        });
    });
}

module.exports = refresh;