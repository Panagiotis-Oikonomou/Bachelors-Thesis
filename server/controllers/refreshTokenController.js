const jwt = require('jsonwebtoken');
const { refreshTokens, generateAccessToken, generateRefreshToken } = require('../services/tokenService');

const refresh = (req, res) => {
    // const refreshToken = req.body.token;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json("Cookies dodnt exist");

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const ref = refreshTokens.find(token => token === refreshToken);

    if(!ref) return res.status(403);

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json("Invalid refresh token");
        }

        // refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        const newAccessToken = generateAccessToken(user.id, user.isAdmin);
        // const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);

        // refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken
        });
    })
}

module.exports = refresh;
