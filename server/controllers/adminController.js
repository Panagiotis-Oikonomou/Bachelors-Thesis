const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProfile = async (req, res) => {
    try {
        const sql = "SELECT * FROM admins WHERE `adminid`=?";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows[0] || null);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong get profile" });
    }
}

exports.updateAdmin = async (req, res) => {
    try {
        const sql = "UPDATE admins SET `fname`=?, `lname`=?, `email`=?, `username`=?, `password`=? WHERE `adminid`=?";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.username,
            req.body.password,
            req.user.id
        ];
        await db.query(sql, values);
        res.json(req.body);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong edit admin" });
    }
}