const db = require('../config/db');

exports.getChats = async (req, res) => {
    try {
        const sql = "SELECT cu.chatid, u.username FROM chat_users cu JOIN users u ON u.userid = cu.userid JOIN  (SELECT DISTINCT chatid FROM chat_users WHERE userid = ?) g ON g.chatid = cu.chatid";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}