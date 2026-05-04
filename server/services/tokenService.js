const jwt = require('jsonwebtoken');

let refreshTokens = [];

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: "30s" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn: '1d'});
}

// const refresh = async (req, res) => {
//     const refreshToken = req.body.token;

//     if (!refreshToken) return res.status(401).json("You are not authenticated");

//     if (!refreshTokens.includes(refreshToken)) {
//         return res.status(403).json("Refresh token is not valid");
//     }

//     jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json("Invalid refresh token");
//         }

//         refreshTokens = refreshTokens.filter(token => token !== refreshToken);

//         const newAccessToken = generateAccessToken(user.id, user.isAdmin);
//         const newRefreshToken = generateRefreshToken(user.id, user.isAdmin);

//         refreshTokens.push(newRefreshToken);

//         res.status(200).json({
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken
//         });
//     })
// }

const storeRefreshTokens = (token) => {
    refreshTokens.push(token);
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, refreshTokens
}