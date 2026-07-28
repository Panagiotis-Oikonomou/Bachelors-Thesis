const db = require('../config/db');
const bcrypt = require("bcrypt");

exports.getProfile = async (req, res) => {
    try {
        let sql = "SELECT fname, lname, clock, provider, email, username FROM users WHERE userid=?";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows[0] || null);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const sql = "UPDATE users SET fname=?, lname=?, clock=?, provider=?, email=?, username=?, password=? WHERE userid=?";
        const sqlNoPassword = "UPDATE users SET fname=?, lname=?, clock=?, provider=?, email=?, username=? WHERE userid=?";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.clock,
            req.body.provider,
            req.body.email,
            req.body.username,
        ];
        if (req.body.password === "") {
            values.push(req.user.id);
            await db.query(sqlNoPassword, values);
        }
        
        else {
            const hash = await bcrypt.hash(req.body.password, 12);
            values.push(hash);
            values.push(req.user.id);
            await db.query(sql, values);
        }

        res.json(req.body);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}