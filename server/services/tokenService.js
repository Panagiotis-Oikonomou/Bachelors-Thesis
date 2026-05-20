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

const removeRefreshToken = (id, token) => {
    if (!refreshTokens.has(id)) return;

    const userTokens = refreshTokens.get(id);

    userTokens.delete(token);

    // cleanup empty sets
    if (userTokens.size === 0) {
        refreshTokens.delete(id);
    }
}

const hasRefreshToken = (id, token) => {

    if (!refreshTokens.has(id)) return false;

    return refreshTokens.get(id).has(token);
};

const removeAllUserTokens = (id) => {
    refreshTokens.delete(id);
};

const findUserByRefreshToken = (token) => {
    for (const [userId, tokens] of refreshTokens.entries()) {
        if (tokens.has(token)) {
            return userId;
        }
    }

    return null;
};

const findUser = (id) => {
    if(refreshTokens.has(id)) return true;

    return false;
};

const showTokens = () => {
    console.log(refreshTokens);
}

const clearRefreshCookie = (res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false});
}

const setRefreshCookie = (res, rt) => {
    res.cookie('jwt', rt, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 24 * 60 * 60 * 1000 });
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, removeRefreshToken, refreshTokens, showTokens,
    hasRefreshToken, removeAllUserTokens,
    clearRefreshCookie, setRefreshCookie, findUserByRefreshToken,
    findUser
}