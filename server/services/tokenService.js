const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let refreshTokens = new Map();

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin, jti:crypto.randomUUID() }, process.env.SECRET_JWT_KEY, { expiresIn: "10s" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin, jti:crypto.randomUUID() }, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn: '15m'});
}

const storeRefreshTokens = (token, id) => {
    if(!refreshTokens.has(id)) refreshTokens.set(id, new Set());

    refreshTokens.get(id).add(token);
}

const removeRefreshTokens = (id, token) => {
    if (!refreshTokens.has(id)) return;

    const userTokens = refreshTokens.get(id);

    userTokens.delete(token);

    // cleanup empty sets
    if (userTokens.size === 0) {
        refreshTokens.delete(id);
    }
}

const hasRefreshToken = async (id, token) => {

    if (!refreshTokens.has(id)) return false;

    return refreshTokens.get(id).has(token);
};

const removeAllUserTokens = (id) => {
    refreshTokens.delete(id);
};

const showTokens = () => {
    console.log(refreshTokens);
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, removeRefreshTokens, refreshTokens, showTokens,
    hasRefreshToken, removeAllUserTokens
}