const jwt = require('jsonwebtoken');

let refreshTokens = new Set();

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: "10s" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn: '1d'});
}

const storeRefreshTokens = (token) => {
    refreshTokens.add(token);
}

const removeRefreshTokens = (token) => {
    refreshTokens.delete(token);
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, removeRefreshTokens, refreshTokens
}