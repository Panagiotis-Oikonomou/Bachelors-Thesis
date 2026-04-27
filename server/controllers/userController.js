const db = require('../config/db');
const jwt = require("jsonwebtoken");

let refreshTokens = []

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
    return jwt.sign({ userid: id, isAdmin }, process.env.SECRET_JWT_KEY, { expiresIn: 300 });
}


exports.login = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `username`=? AND `password`=? LIMIT 1";
        const sql2 = "SELECT adminid FROM admins WHERE `username`=? AND `password`=? LIMIT 1";
        const usr = req.body.usr;
        const psw = req.body.psw;
        // const hashedPassword = await bcrypt.hash(password, 10);
        // const isMatch = await bcrypt.compare(psw, user.password);

        const [rows] = await db.query(sql, [usr, psw]);
        const [rows2] = await db.query(sql2, [usr, psw]);
        let accessToken;

        if (rows.length > 0) {
            const id = rows[0].userid;
            // here the id will be the name of the field so you can access it like that token.id
            // const token = jwt.sign({ id, isAdmin: false }, process.env.SECRET_JWT_KEY, { expiresIn: 300 });
            accessToken = generateAccessToken(id, false);
            // return res.json({ exists: true, token });
        }
        else if (rows2.length > 0) {
            const id = rows2[0].adminid;
            accessToken = generateAccessToken(id, true);
        }
        else return res.json({ exists: false });

        return res.json({ exists: true, accessToken });
        // res.json({exists: rows.length > 0});
        // if (rows.length === 0) return res.json({ exists: false });
        // return res.json({ exists: true });
    }
    catch (err) { return res.status(500).json({ error: "Error with login" }); }
}

exports.getProfile = async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE `userid`=?";
        const id = req.params.id;

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

exports.verifyJwt = (req, res, next) => {
    // const token = req.headers["access-token"];
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token required" });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json("we need token");
    }

    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, decoded) => {
        if (err) return res.status(403).json("Not authenticated");
        else {
            req.user = decoded;
            next();
        }
    });
}

exports.jwtAuth = (req, res) => {
    return res.json({ message: "Protected data", user: req.user });
}