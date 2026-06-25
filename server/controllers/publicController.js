const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshToken, hasRefreshToken, clearRefreshCookie, setRefreshCookie, removeAllUserTokens } = require('../services/tokenService');
const { addCriteria } = require('../controllers/criteriaController');

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

        const [rows] = await db.query(sql, values);
        await addCriteria(rows.insertId);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong register" });
    }
}

exports.login = async (req, res) => {
    try {
        const sql = "SELECT userid, username FROM users WHERE username=? AND password=? LIMIT 1";
        const sql2 = "SELECT adminid, username FROM admins WHERE username=? AND password=? LIMIT 1";
        const { usr, psw, persist } = req.body;

        const [rows] = await db.query(sql, [usr, psw]);
        const [rows2] = await db.query(sql2, [usr, psw]);

        const cookies = req.cookies;
        if (cookies?.jwt) {
            const rt = cookies.jwt;

            jwt.verify(rt, process.env.SECRET_REFRESH_JWT_KEY, async (err, decoded) => {
                if (err) {
                    console.log('Invalid refresh token');
                    return;
                }
                const tokenExists = await hasRefreshToken(decoded.id, rt);
                if (!tokenExists) {
                    console.log('attempted refresh token reuse');
                    await removeAllUserTokens(decoded.id)
                }
                else await removeRefreshToken(decoded.id, rt);
            });
            clearRefreshCookie(res);
        }

        if (rows.length > 0) {
            const accessToken = generateAccessToken(rows[0].userid, rows[0].username, false);
            if (persist) {
                const refreshToken = generateRefreshToken(rows[0].userid, rows[0].username, false);
                await storeRefreshTokens(refreshToken, rows[0].userid);
                setRefreshCookie(res, refreshToken);
            }

            res.json({ exists: true, isAdmin: false, accessToken });
        }
        else if (rows2.length > 0) {
            const accessToken = generateAccessToken(rows2[0].adminid, rows2[0].username, true);
            if (persist) {
                const refreshToken = generateRefreshToken(rows2[0].adminid, rows2[0].username, true);
                await storeRefreshTokens(refreshToken, rows2[0].adminid);
                setRefreshCookie(res, refreshToken);
            }

            res.json({ exists: true, isAdmin: true, accessToken });
        }
        else return res.json({ exists: false });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
}