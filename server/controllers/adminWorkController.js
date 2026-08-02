const db = require('../config/db');

const deleteUserFunc = async (userid) => {
    const sql = "DELETE FROM users WHERE userid = ?";
    const sqlArea = "DELETE FROM areas WHERE userid = ?";
    const sqlCriteria = "DELETE FROM criterias WHERE userid = ?";
    const sqlNotification = "DELETE FROM notifications WHERE userid = ?";
    const sqlMatchings = "DELETE FROM matchings WHERE userid = ?";
    const sqlChatUser = "DELETE FROM chat_users WHERE userid = ?";
    const sqlMessages = "DELETE FROM messages WHERE userid = ?";
    const sqlWaitingToDelete = "DELETE FROM waiting_deleted_chats WHERE userid = ?";
    const sqlAlgoGroupDelete = "DELETE FROM algo_group WHERE userid = ?";
    const sqlUnreadDelete = "DELETE FROM offline_chat WHERE userid = ?";

    const sqlUnreadAllDelete = "DELETE FROM offline_chat WHERE chatid = ?";
    const sqlAlgoGroupAllDelete = "DELETE FROM algo_group WHERE groupid = ?";
    const sqlAllChatDelete = "DELETE FROM chats WHERE chatid = ?";
    const sqlAllUsersChatDelete = "DELETE FROM chat_users WHERE chatid = ?";
    const sqlNotificationToAll = "INSERT INTO notifications (userid, message, type) VALUES (?, ?, ?)";
    const sqlGetGroup = "SELECT groupid FROM chats WHERE chatid = ?";
    const sqlGroupDelete = "DELETE FROM groups WHERE groupid = ?";
    const sqlMatchingsDelete = "DELETE FROM matchings WHERE groupid = ?";
    const sqlWaitingAllDelete = "DELETE FROM waiting_deleted_chats WHERE chatid = ?";
    const sqlAllMessagesDelete = "DELETE FROM messages WHERE chatid = ?";

    const sqlAllChats = "SELECT cu.chatid, cu.userid, c.chat_name FROM chats c JOIN chat_users cu ON c.chatid = cu.chatid WHERE c.chatid IN  (SELECT chatid FROM chat_users WHERE userid = ?) ORDER BY c.chatid, cu.userid";

    try {
        await db.beginTransaction();

        const [rows] = await db.query(sqlAllChats, [userid]);
        const grouped = rows.reduce((acc, item) => {
            if (!acc[item.chatid]) acc[item.chatid] = [];

            acc[item.chatid].push(item);
            return acc;
        }, {});

        await db.query(sqlNotification, [userid]);

        if (Object.keys(grouped).length) {
            for (const [chatId, members] of Object.entries(grouped)) {
                const remainingUsers = members.filter(m => m.userid != userid);
                if (remainingUsers.length < 5) {
                    const [groupid] = await db.query(sqlGetGroup, [chatId]);
                    await db.query(sqlMatchingsDelete, [groupid[0].groupid]);
                    await db.query(sqlUnreadAllDelete, [chatId]);
                    await db.query(sqlGroupDelete, [groupid[0].groupid]);
                    await db.query(sqlAlgoGroupAllDelete, [groupid[0].groupid]);
                    await db.query(sqlWaitingAllDelete, [chatId]);
                    await db.query(sqlAllMessagesDelete, [chatId]);
                    await db.query(sqlAllUsersChatDelete, [chatId]);
                    await db.query(sqlAllChatDelete, [chatId]);

                    for (const member of remainingUsers) {
                        const message = `Η ομάδα με chat όνομα ${member.chat_name} δεν έχει αρκετά μέλη οπότε διαγράφηκε.`;

                        await db.query(sqlNotificationToAll, [member.userid, message, "info"]);
                    }
                }
            }
        }

        await db.query(sqlMessages, [userid]);
        await db.query(sqlUnreadDelete, [userid]);
        await db.query(sqlMatchings, [userid]);
        await db.query(sqlCriteria, [userid]);
        await db.query(sqlAlgoGroupDelete, [userid]);
        await db.query(sqlWaitingToDelete, [userid]);
        await db.query(sqlChatUser, [userid]);

        await db.query(sqlArea, [userid]);
        await db.query(sql, [userid]);
        await db.commit();
    }
    catch (err) {
        await db.rollback();
        throw err;
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userid = req.params.userid;
        await deleteUserFunc(userid)
        return res.sendStatus(200);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.deleteUsers = async (req, res) => {
    try {
        const userIds = req.body.users;
        if (!Array.isArray(userIds) || userIds.length === 0) return res.status(400).json({ message: "No users provided" });

        await Promise.all(userIds.map(userid => deleteUserFunc(userid)));
        return res.sendStatus(200);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const sql = "SELECT userid, fname, lname, clock, provider, email, username FROM users ORDER BY username";

        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.deleteProvider = async (req, res) => {
    try {
        const sql = "DELETE FROM providers WHERE providerid = ?";
        const sqlProviderId = "SELECT providername FROM providers WHERE providerid = ?";
        const sqlUpdate = "UPDATE users SET provider = '' WHERE provider = ?";
        const id = req.params.providerid;

        const [rows] = await db.query(sqlProviderId, [id]);
        if (rows.length === 0) return res.sendStatus(404);

        await db.query(sql, [id]);
        await db.query(sqlUpdate, [rows[0].providername]);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.addProvider = async (req, res) => {
    try {
        const sql = "INSERT INTO providers (providername) VALUES (?)";
        const provider = req.body.providername;
        await db.query(sql, [provider]);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}