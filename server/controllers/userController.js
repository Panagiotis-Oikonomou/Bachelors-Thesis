const db = require('../config/db');
const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');

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
            const accessToken = tokenService.generateAccessToken(rows[0].userid, false);
            const refreshToken = tokenService.generateRefreshToken(rows[0].userid, false);
            tokenService.storeRefreshTokens(refreshToken);
            res.json({ exists: true, isAdmin:false, accessToken, refreshToken });
        }
        else if (rows2.length > 0) {
            const accessToken = tokenService.generateAccessToken(rows2[0].userid, true);
            const refreshToken = tokenService.generateRefreshToken(rows2[0].userid, true);
            tokenService.storeRefreshTokens(refreshToken);
            res.json({ exists: true, isAdmin:true,accessToken, refreshToken });
        }
        else return res.json({ exists: false });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
}

exports.logout = async (req, res) => {
    const refreshToken = req.body.token;

    tokenService.refreshTokens = tokenService.refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json("You have logout successfully");
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