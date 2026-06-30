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
        const { users, groupid } = req.body;
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

const noAgrement = async (res, result, groupid, username, userid) => {
    const deleteMembersGroupSql = "DELETE FROM matchings WHERE userid = ? AND groupid = ?";
    const makeDisableSql = "UPDATE notifications SET disabled = 1 WHERE groupid = ?";
    db.query(makeDisableSql, [groupid]);
    const createInfoNotificationSql = "INSERT INTO notifications (userid, message, type) VALUES (?, ?, ?)";
    const message = `The user ${username} didn't want to make a group with you.`;
    for (const r of result) {
        await db.query(deleteMembersGroupSql, [r.userid, groupid]);
        if (r.userid === userid) continue;
        await db.query(createInfoNotificationSql, [r.userid, message, "info"]);
    }
    const deleteGroupSql = "DELETE FROM groups WHERE groupid = ?";
    await db.query(deleteGroupSql, [groupid]);
    return res.sendStatus(201);
}

exports.updateAgrees = async (req, res) => {
    try {
        const { notid, agrees } = req.body;
        const getGroupIdSql = "SELECT u.userid, n.groupid, u.username FROM notifications n JOIN users u ON u.userid = n.userid WHERE n.notid=?";
        const [gi] = await db.query(getGroupIdSql, [notid]);

        if (gi.length === 0) {
            return res.sendStatus(404);
        }

        const sql = "UPDATE matchings SET agrees = ? WHERE userid = ? AND groupid = ?";
        await db.query(sql, [agrees, gi[0].userid, gi[0].groupid]);


        const getAllMembersSql = "SELECT agrees, userid FROM matchings WHERE groupid = ?";
        const [result] = await db.query(getAllMembersSql, [gi[0].groupid]);
        if (!agrees) {
            noAgrement(res, result, gi[0].groupid, gi[0].username, gi[0].userid);
        }

        let allAgree = 1;
        for (const r of result) {
            if (!r.agrees) {
                allAgree = 0;
                break;
            }
        }
        if (allAgree) {
            const chatCreationSql = "INSERT INTO chats () VALUES ()";
            const [chat] = await db.query(chatCreationSql);
            const addUsersToChatSql = "INSERT INTO chat_users (chatid, userid) VALUES (?, ?)";
            for (const r of result) {
                await db.query(addUsersToChatSql, [chat.insertId, r.userid]);
            }
        }
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}