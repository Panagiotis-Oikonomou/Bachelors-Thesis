const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const sql = "SELECT * FROM notifications WHERE userid = ? ORDER BY notid DESC";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows);
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
    const users = req.body;
    const areaid = users.find(u => u.areaid !== null && u.areaid !== '')?.areaid;

    try {
        const areaDaraSql = "SELECT name, size, lat, lng, ac FROM areas WHERE areaid = ?";
        const [rows] = await db.query(areaDaraSql, [areaid]);

        let notification = `Ο χρήστης ${users[0]?.username} σας έχει προσκαλέσει στην ομάδα του με τα εξής προνόμοια:\n\n`;

        notification += `Χαρακτηριστικά περιοχής:\n`;
        notification += `Όνομα: ${rows[0].name}\n`;
        notification += `Μέγεθος έκτασης: ${rows[0].size}km²\n`;
        notification += `Latitude: ${rows[0].lat}\n`;
        notification += `Longtitude: ${rows[0].lng}\n`;
        notification += `Ποσότητα PV ενέργειας: ${rows[0].ac}kwh\n\n`;

        const essentialsSql = "SELECT money FROM criterias WHERE userid = ?";
        let sum = 0;
        for(const user of users){
            const [essentialsRows] = await db.query(essentialsSql, [user.userid]);
            if (essentialsRows[0]?.money !== null) sum += Number(essentialsRows[0].money);
        }

        notification += `Προσφέρονται συνολικά ${sum}€ μαζί με κάποιον για τα διαδικαστικά ή και άλλες ενέργειες.\n\n`;
        notification += `Τι ζητάει ο κάθε χρήστης:\n`;

        const userCriteriaSql = "SELECT areasize, energy, income FROM criterias WHERE userid = ?";
        for(const user of users){
            const [userCriteriaRows] = await db.query(userCriteriaSql, [user.userid]);
            notification += `${user.username}\n`;
            if (userCriteriaRows[0]?.areasize !== null) notification += `Ελάχιστη έκταση περιοχής: ${Math.round(userCriteriaRows[0].areasize)}km²\n`;
            if (userCriteriaRows[0]?.energy !== null) notification += `Ελάχιστη ποσότητα PV ενέργειας: ${userCriteriaRows[0].energy}kwh\n`;
            if (userCriteriaRows[0]?.income !== null) notification += `Ελάχιστο ποσό εσόδων: ${Math.round(userCriteriaRows[0].income)}%\n`;
            notification += '\n';
        }
        const newGroupSql = "INSERT INTO groups VALUES ()";

        const [create] = await db.query(newGroupSql);
        const addNotificationSql = "INSERT INTO notifications (userid, groupid, message, is_read, type) VALUES (?, ?, ?, ?, ?)";
        for(const user of users){
            await db.query(addNotificationSql, [user.userid, create.insertId, notification, false, "conf"]);
        }
        res.status(201).json({groupid: create.insertId});

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