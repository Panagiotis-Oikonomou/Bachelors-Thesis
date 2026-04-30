const db = require("../config/db");

// REGISTER CHECKS
exports.checkUsername = async (req, res) => {
    try {
        const sql = "SELECT username FROM users WHERE `username`=?";
        const username = req.query.username;

        if(!username) return;

        const [rows] = await db.query(sql, [username]);
        res.json({ exists: rows.length > 0 });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong username" });
    }
}

exports.checkEmail = async (req, res) => {
    try {
        const sql = "SELECT 1 FROM users WHERE `email`=? LIMIT 1";
        const email = req.query.email;

        if(!email) return;

        const [rows] = await db.query(sql, [email]);
        res.json({ exists: rows.length > 0 });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong email" });
    }
}

exports.checkClock = async (req, res) => {
    try {
        const sql = "SELECT 1 FROM users WHERE `clock`=? LIMIT 1";
        const clock = req.query.clock;

        if(!clock) return;

        const [rows] = await db.query(sql, [clock]);

        res.json({ exists: rows.length > 0 });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong clock" });
    }
}

// PROFILE CHECKS
exports.checkUsernameProfile = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `username` = ?";
        const username = req.query.username;
        const id = req.query.id;

        const [rows] = await db.query(sql, [username]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) return res.json({ exists: false });

        return res.json({ exists: true });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong username profile" });
    }
}

exports.checkEmailProfile = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `email` = ?";
        const email = req.query.email;
        const id = req.query.id;

        const [rows] = await db.query(sql, [email]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) return res.json({ exists: false });

        return res.json({ exists: true });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong email profile" });
    }
}

exports.checkClockProfile = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `clock` = ?";
        const clock = req.query.clock;
        const id = req.query.id;

        const [rows] = await db.query(sql, [clock]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) { return res.json({ exists: false }); }

        return res.json({ exists: true });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong clock profile" });
    }
}

exports.checkPasswordProfile = async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `password` = ?";
        const password = req.query.password;
        const id = req.query.id;

        const [rows] = await db.query(sql, [password]);

        // if (rows.length === 0) return res.json({ exists: false });
        if (rows.length != 0) return res.json({ exists: rows[0].userid == id })
        // if (rows[0].userid == id) return res.json({ exists: true });

        // return res.json({ exists: true });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong password profile" });
    }
}