const jwt = require('jsonwebtoken');

let refreshTokens = [];

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: "30s" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn: '1d'});
}

const storeRefreshTokens = (token) => {
    refreshTokens.push(token);
}

const removeRefreshTokens = (token) => {
    refreshTokens = refreshTokens.filter(t => t !== token);
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, removeRefreshTokens, refreshTokens
}