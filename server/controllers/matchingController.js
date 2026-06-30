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

exports.createMatchings = async (req, res) => {
    try {
        const sql = "INSERT INTO matchings (groupid, userid) VALUES (?, ?)";
        const {users, groupid } = req.body;
        for (const user of users) {
            await db.query(sql, [groupid, user.userid]);
        }
        return res.sendStatus(201);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

exports.updateAgrees = async (req, res) => {
    try {
        const sql = "UPDATE matchings SET agrees = ? WHERE userid = ? AND groupid = ?";
        const getGroupIdSql = "SELECT userid, groupid FROM notifications WHERE notid=?";
        const {notid, agrees} = req.body;
        const [gi] = await db.query(getGroupIdSql, [notid]);
        await db.query(sql, [agrees, gi[0].userid, gi[0].groupid]);

        const getAllMembersSql = "SELECT agrees, userid FROM matchings WHERE groupid = ?";
        const [result] = await db.query(getAllMembersSql, [gi[0].groupid]);
        let allAgree;
        for(const r of result){
            if(!r.agrees){
                allAgree = 0;
                break;
            }
            allAgree = 1;
        }
        console.log(allAgree);
        if(allAgree){
            const chatCreationSql = "INSERT INTO chats VALUES ()";
            const [chat] = await db.query(chatCreationSql);
            const addUsersToChatSql = "INSERT INTO chat_users (chatid, userid) VALUES (?, ?)";
            for(const r of result){
                await db.query(addUsersToChatSql, [chat.insertId, r.userid]);
            }
        }
        res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}