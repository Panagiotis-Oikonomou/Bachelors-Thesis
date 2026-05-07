const db = require('../config/db');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken, storeRefreshTokens} = require('../services/tokenService');

exports.register = async (req, res) => {
    try {
        const sql = "INSERT INTO users (fname, lname, clock, provider, email, username,  password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.clock,
            req.body.provider,
            req.body.email,
            req.body.username,
            req.body.password
        ];

        await db.query(sql, values);
        res.status(201).json({ message: "User added successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong register" });
    }
}

exports.login = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `username`=? AND `password`=? LIMIT 1";
        const sql2 = "SELECT adminid FROM admins WHERE `username`=? AND `password`=? LIMIT 1";
        const { usr, psw } = req.body;

        const [rows] = await db.query(sql, [usr, psw]);
        const [rows2] = await db.query(sql2, [usr, psw]);

        if (rows.length > 0) {
            const accessToken = generateAccessToken(rows[0].userid, false);
            const refreshToken = generateRefreshToken(rows[0].userid, false);
            storeRefreshTokens(refreshToken);
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true,maxAge: 24 * 60 * 60 * 1000});
            res.json({ exists: true, isAdmin:false, accessToken });
        }
        else if (rows2.length > 0) {
            const accessToken = generateAccessToken(rows2[0].userid, true);
            const refreshToken = generateRefreshToken(rows2[0].userid, true);
            storeRefreshTokens(refreshToken);
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true,maxAge: 24 * 60 * 60 * 1000});
            res.json({ exists: true, isAdmin:true,accessToken });
        }
        else return res.json({ exists: false });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
}