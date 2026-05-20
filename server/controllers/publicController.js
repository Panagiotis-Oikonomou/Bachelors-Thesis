const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, storeRefreshTokens, removeRefreshToken, hasRefreshToken, clearRefreshCookie, setRefreshCookie, showTokens, removeAllUserTokens } = require('../services/tokenService');

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

        const cookies = req.cookies;
        console.log(`cookie available at: ${JSON.stringify(cookies)}`);
        showTokens();
        if (cookies?.jwt) {
            const rt = cookies.jwt;
            const rtDecoded = jwt.decode(rt);
            // if(rtDecoded?.id && hasRefreshToken(rtDecoded.id, rt)) {
            //     console.log('existing session found, rotating refresh token');
            //     removeRefreshToken(rtDecoded.id, rt);
            // }
            // clearRefreshCookie(res);

            jwt.verify(rt, process.env.SECRET_REFRESH_JWT_KEY, async (err, decoded) => {
                if(err) console.log('Invalid refresh token');
                const tokenExists = hasRefreshToken(decoded.id, rt);
                if(!tokenExists){
                    console.log('attempted refresh token reuse');
                    removeAllUserTokens(decoded.id)
                }
                else removeRefreshToken(decoded.id, rt);
            });
            // const foundToken = hasRefreshToken(rtDecoded.id, rt);
            // if(!foundToken){
            //     console.log('attempted refresh token reuse at login');
            //     removeAllUserTokens(rtDecoded.id);
            // }
            clearRefreshCookie(res);
        }

        if (rows.length > 0) {
            const accessToken = generateAccessToken(rows[0].userid, false);
            const refreshToken = generateRefreshToken(rows[0].userid, false);

            storeRefreshTokens(refreshToken, rows[0].userid);
            setRefreshCookie(res, refreshToken);
            showTokens();
            res.json({ exists: true, isAdmin: false, accessToken });
        }
        // else if (rows2.length > 0) {
        //     const accessToken = generateAccessToken(rows2[0].userid, true);
        //     const refreshToken = generateRefreshToken(rows2[0].userid, true);
        //     storeRefreshTokens(refreshToken);
        //     res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true,maxAge: 24 * 60 * 60 * 1000});
        //     res.json({ exists: true, isAdmin:true,accessToken });
        // }
        else return res.json({ exists: false });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
}