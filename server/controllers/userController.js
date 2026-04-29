const db = require('../config/db');
const jwt = require('jsonwebtoken');

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

const generateAccessToken = (id, isAdmin) => {
    return accessToken = jwt.sign({ id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: "5m" });
}

const generateRefreshToken = (id, isAdmin) => {
    return refreshToken = jwt.sign({ id, isAdmin }, process.env.SECRET_REFRESH_JWT_KEY);
}

exports.login = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `username`=? AND `password`=? LIMIT 1";
        const sql2 = "SELECT adminid FROM admins WHERE `username`=? AND `password`=? LIMIT 1";
        // const usr = req.body.usr;
        // const psw = req.body.psw;
        const { usr, psw } = req.body;

        const [rows] = await db.query(sql, [usr, psw]);
        const [rows2] = await db.query(sql2, [usr, psw]);

        if (rows.length > 0) {
            // generate accesstoken
            // const accessToken = jwt.sign({id: rows[0].userid, isAdmin: false}, process.env.SECRET_JWT_KEY, {expiresIn:"20s"});
            // const refreshToken = jwt.sign({id: rows[0].userid, isAdmin: false}, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn:"20s"});
            const accessToken = generateAccessToken(rows[0].userid, false);
            const refreshToken = generateRefreshToken(rows[0].userid, false);
            refreshTokens.push(refreshToken);
            res.json({ exists: true, accessToken, refreshToken });
        }
        else if (rows2.length > 0) {
            // const accessToken = jwt.sign({id: rows2[0].adminid, isAdmin: true}, process.env.SECRET_JWT_KEY, {expiresIn:"5m"});
            // const refreshToken = jwt.sign({id: rows[0].userid, isAdmin: false}, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn:"20s"});
            const accessToken = generateAccessToken(rows2[0].userid, false);
            const refreshToken = generateRefreshToken(rows2[0].userid, false);
            refreshTokens.push(refreshToken);
            res.json({ exists: true, accessToken, refreshToken });
        }
        else return res.status(400).json({ exists: false });
        // res.json({exists: rows.length > 0});
        // if (rows.length === 0) return res.json({ exists: false });
        // return res.json({ exists: true });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
}

let refreshTokens = [];

exports.refresh = async (req, res) => {
    // take the refresh token from user
    const refreshToken = req.body.token;

    // send error if there is no token or not valid
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
    // if everything is okay create new access token, also refresh and send to user
}

exports.logout = async (req, res) => {
    const refreshToken = req.body.token;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json("You have logout successfully");
}

exports.getProfile = async (req, res) => {
    // if(req.user.id ) 
    try {
        const isAdmin = req.user.isAdmin;
        let sql;
        if (isAdmin) {
            sql = "SELECT * FROM admins WHERE `adminid`=?";
        }
        else {
            sql = "SELECT * FROM users WHERE `userid`=?";
        }

        // const id = req.params.id;
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
            req.params.id
        ];
        await db.query(sql, values);
        res.json({ values });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong edit user" });
    }
}

exports.verify = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
            // the user here contains the payload
            if (err) return res.status(403).json("Token is not valid");

            req.user = user;
            next();

        });
    }
    else res.status(401).json("You are not Authenticated");
}