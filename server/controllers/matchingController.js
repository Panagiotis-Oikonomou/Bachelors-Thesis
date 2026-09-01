const db = require('../config/db');
const crypto = require("crypto");

exports.getMatchings = async (req, res) => {
    try {
        const sql = "SELECT m.groupid, m.agrees, u.username, m.rowid, m.userid FROM matchings m JOIN users u ON u.userid = m.userid JOIN  (SELECT DISTINCT groupid FROM matchings WHERE userid = ?) g ON g.groupid = m.groupid";

        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.getOnlineGroupUsers = async (req, res) => {
    try {
        const sql1 = "SELECT * FROM matchings WHERE groupid = ? AND agrees = 1 AND userid IN (?)";
        const sql2 = "SELECT * FROM matchings WHERE groupid = ? AND userid IN (?)";
        const getRecipients = req.body.getRecipients || [];
        const { groupid, choice } = req.body;
        const userIds = getRecipients.map(r => r.userId);
        if (userIds.length === 0) return res.status(200).json([]);

        if (choice) {
            const [result] = await db.query(sql2, [groupid, userIds]);
            return res.status(200).json(result);
        }
        else {
            const [result] = await db.query(sql1, [groupid, userIds]);
            return res.status(200).json(result);
        }
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.createMatchings = async (req, res) => {
    try {
        const sql = "INSERT INTO matchings (groupid, userid) VALUES (?, ?)";
        const { users, groupid } = req.body;
        const usersNoUser = users.filter(u => u.userid != req.user.id);
        for (const user of usersNoUser) {
            await db.query(sql, [groupid, user.userid]);
        }
        return res.sendStatus(201);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

const noAgrement = async (result, groupid, username, userid) => {
    const deleteMembersGroupSql = "DELETE FROM matchings WHERE groupid = ?";
    const deleteAlgoGroupSql = "DELETE FROM algo_group WHERE groupid = ?";
    const deletePotentialSql = "DELETE FROM potential_areaid WHERE groupid = ?";
    const makeDisableSql = "UPDATE notifications SET disabled = 1 WHERE groupid = ?";
    db.query(makeDisableSql, [groupid]);
    const createInfoNotificationSql = "INSERT INTO notifications (userid, message, type) VALUES (?, ?, ?)";
    const message = `Ο χρήστης ${username} δεν ήθελε να είναι στην ομάδα σας.`;

    await db.query(deleteMembersGroupSql, [groupid]);
    await db.query(deleteAlgoGroupSql, [groupid]);
    await db.query(deletePotentialSql, [groupid]);
    const not = [];
    for (const r of result) {
        if (r.userid === userid) continue;
        const [id] = await db.query(createInfoNotificationSql, [r.userid, message, "info"]);
        not.push({
            notid: id.insertId,
            userid: r.userid,
            groupid: 0,
            message: message,
            type: "info",
            disabled: 0,
            is_read: 0,
            expanded: false
        });
    }
    const deleteGroupSql = "DELETE FROM groups WHERE groupid = ?";
    await db.query(deleteGroupSql, [groupid]);
    return not;
}

exports.updateAgrees = async (req, res) => {
    try {
        const { notid, agrees } = req.body;
        const getGroupIdSql = "SELECT u.userid, n.groupid, u.username FROM notifications n JOIN users u ON u.userid = n.userid WHERE n.notid=?";
        const [gi] = await db.query(getGroupIdSql, [notid]);

        if (gi.length === 0) {
            return res.sendStatus(404);
        }

        const getAllMembersSql = "SELECT agrees, userid FROM matchings WHERE groupid = ?";
        let [result] = await db.query(getAllMembersSql, [gi[0].groupid]);
        if (!agrees) {
            const not = await noAgrement(result, gi[0].groupid, gi[0].username, gi[0].userid);
            return res.status(201).json({ groupid: gi[0].groupid, not });
        }

        const sql = "UPDATE matchings SET agrees = ? WHERE userid = ? AND groupid = ?";
        const [updateResult] = await db.query(sql, [1, gi[0].userid, gi[0].groupid]);

        let allAgree = 1;
        result = result.map(r => r.userid === gi[0].userid ? { ...r, agrees: 1 } : r);
        for (const r of result) {
            if (r.agrees == 0) {
                allAgree = 0;
                break;
            }
        }
        const returnNot = [];
        let lastUser = false;
        if (allAgree) {
            const chatCreationSql = "INSERT INTO chats (groupid, areaid, chat_name) VALUES (?, ?, ?)";
            const notificationSql = "INSERT INTO notifications (userid, groupid, message, type) VALUES (?, ?, ?, ?)";
            const getAreaIdSql = "SELECT areaid FROM potential_areaid WHERE groupid = ?";
            const [areaid] = await db.query(getAreaIdSql, [gi[0].groupid]);
            const chatName = crypto.randomUUID().slice(0, 10);
            const [chat] = await db.query(chatCreationSql, [gi[0].groupid, areaid[0].areaid, chatName]);
            const addUsersToChatSql = "INSERT INTO chat_users (chatid, userid) VALUES (?, ?)";
            const createDestroySql = "INSERT INTO waiting_deleted_chats (chatid, userid) VALUES (?, ?)";
            const deletePotentialAreaIdSql = "DELETE FROM potential_areaid WHERE groupid = ?";
            const addOfflineMessagesSql = "INSERT INTO offline_chat (chatid, userid) VALUES (?, ?)";
            const message = `Η συνομιλία δημιουργήθηκε με το όνομα «${chatName}», αφού συμφώνησαν και τα υπόλοιπα μέλη`;
            for (const r of result) {
                await db.query(addUsersToChatSql, [chat.insertId, r.userid]);
                await db.query(createDestroySql, [chat.insertId, r.userid]);
                await db.query(addOfflineMessagesSql, [chat.insertId, r.userid]);
                const [id] = await db.query(notificationSql, [r.userid, gi[0].groupid, message, "info"]);
                returnNot.push({
                    notid: id.insertId,
                    chatid: chat.insertId,
                    userid: r.userid,
                    groupid: gi[0].groupid,
                    message: message,
                    type: "info",
                    disabled: 0,
                    is_read: 0,
                    expanded: false
                });
            }
            await db.query(deletePotentialAreaIdSql, [gi[0].groupid]);
            lastUser = true;
        }
        return res.status(201).json({ groupid: gi[0].groupid, returnNot, lastUser });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}