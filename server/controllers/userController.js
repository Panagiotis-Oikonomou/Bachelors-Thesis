const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { removeRefreshTokens, hasRefreshToken } = require('../services/tokenService');

exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    const decoded = jwt.decode(refreshToken);
    if(!hasRefreshToken(decoded.id, refreshToken)) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false });
        console.log('User not existing');
        return res.sendStatus(204);
    }
        // removeRefreshTokens(decoded.id, refreshToken);

    // jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT_KEY, (err, decoded) => {
    //     if (err) {
    //         const decodedId = jwt.decode(refreshToken);
    //         if (decodedId?.id) removeRefreshTokens(decodedId.id, refreshToken);
    //     }
    //     else {
    //         removeRefreshTokens(decoded.id, refreshToken);
    //     }
    // }
    // );
    console.log('User  existing');
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false });
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
        res.json(req.body);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong edit user" });
    }
}