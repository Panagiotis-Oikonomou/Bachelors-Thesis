const db = require('../config/db');

exports.getProviders = async (req, res) => {
    try {
        const sql = "SELECT * FROM providers ORDER BY providername";
        const [rows] = await db.query(sql);
        res.json(rows);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong get providers" });
    }
}