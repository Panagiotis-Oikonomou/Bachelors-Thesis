const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { refreshTokens, removeRefreshTokens } = require('../services/tokenService');

exports.logout = async (req, res) => {
    // on client also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    // if (!refreshTokens.includes(refreshToken)) {
    if (!refreshTokens.has(refreshToken)) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true});
        return res.sendStatus(204);
    }

    removeRefreshTokens(refreshToken);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true});
    return res.sendStatus(204);
}

exports.getProfile = async (req, res) => {
    try {
        const isAdmin = req.user.isAdmin;
        let sql;
        if (isAdmin) {
            sql = "SELECT * FROM admins WHERE `adminid`=?";
        }
        else {
            sql = "SELECT * FROM users WHERE `userid`=?";
        }

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows[0] || null);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong get profile" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const sql = "UPDATE users SET `fname`=?, `lname`=?, `clock`=?, `provider`=?, `email`=?, `username`=?, `password`=? WHERE `userid`=?";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.clock,
            req.body.provider,
            req.body.email,
            req.body.username,
            req.body.password,
            req.user.id
        ];
        await db.query(sql, values);
        res.json({ values });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong edit user" });
    }
}