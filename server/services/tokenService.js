const jwt = require('jsonwebtoken');

let refreshTokens = [];

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: "5m" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.SECRET_REFRESH_JWT_KEY);
}

const refresh = async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) return res.status(401).json("You are not authenticated");

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, user) => {
        if (err) console.log(err);

        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        if (user.isAdmin) {
            const newAccessToken = generateAccessToken(user.id, true);
            const newRefreshToken = generateRefreshToken(user.id, true);

            refreshTokens.push(newRefreshToken);

            res.status(201).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        }
        else {
            const newAccessToken = generateAccessToken(user.id, false);
            const newRefreshToken = generateRefreshToken(user.id, false);
            refreshTokens.push(newRefreshToken);

            res.status(201).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        }
    })
}

const storeRefreshTokens = (token) => {
    refreshTokens.push(token);
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    refresh, storeRefreshTokens, refreshTokens
}