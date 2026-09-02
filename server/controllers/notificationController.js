const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const sql = "SELECT n.*, c.chatid FROM notifications n LEFT JOIN chats c ON n.groupid = c.groupid WHERE n.userid = ? ORDER BY n.notid DESC";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.getGlobalNotifications = async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) AS count  FROM notifications WHERE userid = ? AND is_read = 0";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows[0].count);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.readMessage = async (req, res) => {
    try {
        const sql = "UPDATE notifications SET is_read = TRUE WHERE userid = ? AND notid = ?";
        const userid = req.user.id;
        const notid = req.params.id;

        await db.query(sql, [userid, notid]);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }

}

exports.deleteMessage = async (req, res) => {
    try {
        const sql = "DELETE FROM notifications WHERE userid = ? AND notid = ?";
        const userid = req.user.id;
        const notid = req.params.id;

        await db.query(sql, [userid, notid]);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.createInvitationNotification = async (req, res) => {
    const { users, recipients } = req.body;
    const usersNoUser = users.filter(u => u.userid != req.user.id);
    const areaid = users.find(u => u.areaid !== null && u.areaid !== '')?.areaid;

    try {
        const areaDataSql = "SELECT name, size, lat, lng, ac FROM areas WHERE areaid = ?";
        const [rows] = await db.query(areaDataSql, [areaid]);

        let notification = `Ο χρήστης ${users[0]?.username} σας έχει προσκαλέσει στην ομάδα του με τα εξής προνόμοια:\n\n`;

        notification += `Χαρακτηριστικά περιοχής:\n`;
        notification += `Όνομα: ${rows[0].name}\n`;
        notification += `Μέγεθος έκτασης: ${rows[0].size}m²\n`;
        notification += `Latitude: ${rows[0].lat}\n`;
        notification += `Longtitude: ${rows[0].lng}\n`;
        notification += `Ποσότητα ηλεκτρικής ενέργειας: ${rows[0].ac}kwy\n\n`;

        const essentialsSql = "SELECT money FROM criterias WHERE userid = ?";
        const [userMoney] = await db.query(essentialsSql, [req.user.id]);
        let sum = 0;
        if (userMoney.length > 0) sum += Number(userMoney[0].money);
        for (const user of usersNoUser) {
            const [essentialsRows] = await db.query(essentialsSql, [user.userid]);
            if (essentialsRows[0]?.money !== null) sum += Number(essentialsRows[0].money);
        }

        notification += `Προσφέρονται συνολικά ${sum}€ μαζί με κάποιον για τα διαδικαστικά ή και άλλες ενέργειες.\n\n`;
        notification += `Τι ζητάει ο κάθε χρήστης:\n`;

        const userCriteriaSql = "SELECT areasize, energy, income FROM criterias WHERE userid = ?";
        for (const user of users) {
            const [userCriteriaRows] = await db.query(userCriteriaSql, [user.userid]);
            notification += `${user.username}\n`;
            if (userCriteriaRows[0]?.areasize !== null) notification += `Ελάχιστη έκταση περιοχής: ${Math.round(userCriteriaRows[0].areasize)}m²\n`;
            if (userCriteriaRows[0]?.energy !== null) notification += `Ελάχιστη ποσότητα ηλεκτρικής ενέργειας: ${userCriteriaRows[0].energy}kwy\n`;
            if (userCriteriaRows[0]?.income !== null) notification += `Ελάχιστο ποσό εσόδων: ${Math.round(userCriteriaRows[0].income)}%\n`;
            notification += '\n';
        }
        const newGroupSql = "INSERT INTO groups VALUES ()";
        const alreadyAcceptSql = "INSERT INTO matchings (groupid, userid, agrees) VALUES (?, ?, ?)";
        const potentialAreaIdSql = "INSERT INTO potential_areaid (groupid, areaid) VALUES (?, ?)";

        const [create] = await db.query(newGroupSql);
        await db.query(alreadyAcceptSql, [create.insertId, req.user.id, 1]);
        await db.query(potentialAreaIdSql, [create.insertId, areaid]);
        const addNotificationSql = "INSERT INTO notifications (userid, groupid, message, type) VALUES (?, ?, ?, ?)";
        const returnNot = [];
        for (const user of usersNoUser) {
            const [notId] = await db.query(addNotificationSql, [user.userid, create.insertId, notification, "conf"]);

            if (recipients.some(r => r.userId == user.userid)) {
                returnNot.push({
                    notid: notId.insertId,
                    userid: user.userid,
                    groupid: create.insertId,
                    message: notification,
                    type: "conf",
                    is_read: 0,
                    disabled: 0,
                    expanded: false
                })
            }
        }
        res.status(201).json({ groupid: create.insertId, returnNot });

    } catch (err) {
        console.log(err);
    }
}

exports.updateDisabled = async (req, res) => {
    try {
        const sql = "UPDATE notifications SET disabled=true WHERE notid=?";
        await db.query(sql, [req.params.id]);
        res.sendStatus(200);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

exports.updateAllDisabled = async (req, res) => {
    try {
        const { groupid, getRecipients } = req.body;
        const nameSql = "SELECT u.username, u.userid FROM users u JOIN matchings m ON u.userid = m.userid JOIN criterias c ON u.userid = c.userid WHERE m.groupid = ? AND c.areaid IS NOT NULL";
        const [name] = await db.query(nameSql, [groupid]);
        const message = `Η ομάδα/ες που ήσασταν με τον χρήστη ${name[0].username}, που είχε οικόπεδο διαγράγηκαν, διότι μπήκε σε ομάδα`;

        const sql = "UPDATE notifications SET disabled=true WHERE userid = ? AND type = ?";
        await db.query(sql, [name[0].userid, "conf"]);

        const getGroupIdsSql = "SELECT groupid FROM matchings WHERE userid = ? AND groupid <> ?";
        const [rows] = await db.query(getGroupIdsSql, [name[0].userid, groupid]);

        const groupids = rows.map(row => row.groupid);
        let not = []
        if (groupids.length > 0) {
            const placeholders = groupids.map(() => "?").join(",");

            const updateAllDisabledSql = `UPDATE notifications SET disabled = true WHERE groupid IN (${placeholders})`;
            const deletePotentialSql = `DELETE FROM potential_areaid WHERE groupid IN (${placeholders})`;
            const deleteMatchingsSql = `DELETE FROM matchings WHERE groupid IN (${placeholders})`;
            const deleteAlgoGroupSql = `DELETE FROM algo_group WHERE groupid IN (${placeholders})`;
            const deleteGroupSql = `DELETE FROM groups WHERE groupid IN (${placeholders})`;
            const getUsersSql = `SELECT DISTINCT userid FROM matchings WHERE groupid IN (${placeholders}) AND userid <> ?`;
            
            const [rowUsers] = await db.query(getUsersSql, [...groupids, name[0].userid]);
            await db.query(updateAllDisabledSql, groupids);
            await db.query(deletePotentialSql, groupids);
            await db.query(deleteMatchingsSql, groupids);
            await db.query(deleteAlgoGroupSql, groupids);
            await db.query(deleteGroupSql, groupids);


            const insertNotificationSql = "INSERT INTO notifications (userid, message, type) VALUES (?, ?, ?)";
            
            const onlineUserIds = new Set(getRecipients.map(o => Number(o.userId)));
            for (const user of rowUsers) {

                const [result] = await db.query(insertNotificationSql, [user.userid, message, "info"]);
                if (onlineUserIds.has(Number(user.userid))) {
                    not.push({
                        notid: result.insertId,
                        userid: user.userid,
                        message: message,
                        type: "info",
                        disabled: 0,
                        is_read: 0,
                        expanded: false
                    });
                }
            }
        }

        res.status(200).json({groupids, not});
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}