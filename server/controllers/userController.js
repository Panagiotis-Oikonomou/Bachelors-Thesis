const db = require('../config/db');

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
        const sql = "SELECT 1 FROM users WHERE `username`=? AND `password`=? LIMIT 1";
        const usr = req.body.usr;
        const psw = req.body.psw;

        const [rows] = await db.query(sql, [req.body.usr, req.body.psw]);
        res.json({exists: rows.length > 0});
        // if (rows.length === 0) return res.json({ exists: false });
        // return res.json({ exists: true });
    }
    catch (err) { return res.status(500).json({ error: "Wrong login" }); }
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