const db = require('../config/db');

exports.getChats = async (req, res) => {
    try {
        const sql = "SELECT cu.chatid, u.username FROM chat_users cu JOIN users u ON u.userid = cu.userid JOIN  (SELECT DISTINCT chatid FROM chat_users WHERE userid = ?) g ON g.chatid = cu.chatid";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.status(200).json(rows);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.createMessage = async (req, res) => {
    try {
        const sql = "INSERT INTO messages (chatid, userid, message) VALUES (?, ?, ?)";
        const {chatid, userid, message} = req.body;
        const [rows] = await db.query(sql, [chatid, userid, message]);
        const [messageRow] = await db.query("SELECT * FROM messages WHERE messageid = ?", [rows.insertId]);
        return res.status(201).json(messageRow[0]);
    } catch (error) {
        console.log(error);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const sql = "SELECT m.*, u.username FROM messages m JOIN users u ON u.userid = m.userid WHERE m.chatid = ?";
        const [rows] = await db.query(sql, [req.params.chatid]);
        return res.status(201).json(rows);
    } catch (error) {
        console.log(error);
    }
}