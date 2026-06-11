const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        let sql = "SELECT * FROM users WHERE userid=?";

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
        const sql = "UPDATE users SET fname=?, lname=?, clock=?, provider=?, email=?, username=?, password=? WHERE userid=?";
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
        res.json(req.body);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong edit user" });
    }
}