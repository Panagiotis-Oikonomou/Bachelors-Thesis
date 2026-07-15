const db = require('../config/db');

exports.getChats = async (req, res) => {
    try {
        const sql = "SELECT cu.chatid, u.username, u.userid FROM chat_users cu JOIN users u ON u.userid = cu.userid JOIN  (SELECT DISTINCT chatid FROM chat_users WHERE userid = ?) g ON g.chatid = cu.chatid";

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
        const { chatid, userid, message } = req.body;
        const [rows] = await db.query(sql, [chatid, userid, message]);
        const [messageRow] = await db.query("SELECT m.*, u.username FROM messages m JOIN users u ON m.userid = u.userid WHERE messageid = ?", [rows.insertId]);
        return res.status(201).json(messageRow[0]);
    } catch (error) {
        console.log(error);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const sql = "SELECT m.*, u.username FROM messages m JOIN users u ON u.userid = m.userid WHERE m.chatid = ?";
        const chatNameSql = "SELECT chat_name FROM chats WHERE chatid = ?";
        const [rows] = await db.query(sql, [req.params.chatid]);
        const [rows2] = await db.query(chatNameSql, [req.params.chatid]);
        return res.status(200).json({chat_name: rows2[0].chat_name, rows});
    } catch (error) {
        console.log(error);
    }
}

exports.getOnlineChatUsers = async (req, res) => {
    try {
        const sql = "SELECT userid FROM chat_users WHERE chatid = ? AND userid IN (?)";
        const { getRecipients, chatid } = req.body;
        const userIds = getRecipients.map(r => r.userId);
        if(userIds.length === 0) return res.status(200).json([]);
        const [rows] = await db.query(sql, [chatid, userIds]);
        return res.status(201).json(rows);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const sql = "UPDATE messages SET message = '', unsent = 1 WHERE messageid = ?";
        await db.query(sql, [req.params.messageid]);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
}

exports.getLatestMessages = async (req, res) => {
    try {
        const getChatsSql = "SELECT cu.chatid, m.message FROM chat_users cu LEFT JOIN messages m ON m.messageid = (SELECT messageid FROM messages WHERE chatid = cu.chatid AND unsent = 0 ORDER BY messageid DESC LIMIT 1) WHERE cu.userid = ?";
        const [rows] = await db.query(getChatsSql, [req.params.userid]);
        return res.status(200).json(rows);
    } catch (error) {
        console.log(error);
    }
}

exports.getWatingDelete = async (req, res) => {
    try {
        const sql = "SELECT wdc.*, u.username FROM waiting_deleted_chats wdc JOIN users u ON wdc.userid = u.userid WHERE chatid = ?";
        const [rows] = await db.query(sql, [req.params.chatid]);
        return res.status(200).json(rows);
    } catch (error) {
        console.log(error);
    }
}

exports.changeWaitingDelete = async (req, res) => {
    try {
        const sql = "UPDATE waiting_deleted_chats SET destroy = ? WHERE userid = ? AND chatid = ?";
        await db.query(sql, [req.params.d, req.user.id, req.params.chatid]);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteChat = async (req, res) => {
    try {
        const getGroupSql = "SELECT groupid, chat_name FROM chats WHERE chatid = ?";
        const getUsersSql = "SELECT userid FROM waiting_deleted_chats WHERE chatid = ?";
        const deleteWaitingSql = "DELETE FROM waiting_deleted_chats WHERE chatid = ?";
        const deleteChatUsersSql = "DELETE FROM chat_users WHERE chatid = ?";
        const deleteChatSql = "DELETE FROM chats WHERE chatid = ?";
        const deleteGroupSql = "DELETE FROM groups WHERE groupid = ?";
        const deleteMatchingsSql = "DELETE FROM matchings WHERE groupid = ?";
        const deleteMessagesSql = "DELETE FROM messages WHERE chatid = ?";
        const sendNotificationSql = "INSERT INTO notifications (userid, message, type) VALUES (?, ?, ?)";
        
        const [groupid] = await db.query(getGroupSql, [req.params.chatid]);
        const message = `Έχετε βγει από την ομάδα ${groupid[0].chat_name} μετά από συμφωνία όλων των μελών της`;
        const [users] = await db.query(getUsersSql, [req.params.chatid]);
        await db.query(deleteWaitingSql, [req.params.chatid]);
        await db.query(deleteChatUsersSql, [req.params.chatid]);
        await db.query(deleteChatSql, [req.params.chatid]);
        await db.query(deleteMessagesSql, [req.params.chatid]);
        await db.query(deleteGroupSql, [groupid[0].groupid]);
        await db.query(deleteMatchingsSql, [groupid[0].groupid]);
        
        for(const u of users){
            await db.query(sendNotificationSql, [u.userid, message, "info"]);
        }
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
}