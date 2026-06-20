const db = require('../config/db');

exports.getMatchings = async (req, res) => {
    try {
        const sql = "SELECT m.groupid, m.agrees, u.username, m.rowid FROM matchings m JOIN users u ON u.userid = m.userid JOIN  (SELECT DISTINCT groupid FROM matchings WHERE userid = ?) g ON g.groupid = m.groupid";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}