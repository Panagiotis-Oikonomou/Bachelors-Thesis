const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const sql = "SELECT * FROM notifications WHERE userid = ?";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

// exports.updateArea = async (req, res) => {
//     try {
//         const sql = "UPDATE areas SET name = ?, size = ?, paneltype = ?, ac = ? WHERE userid = ? AND areaid = ?";
//         const userid = req.user.id;
//         const areaid = req.params.id;
//         const { name, size, paneltype, ac } = req.body;
//         const values = [name, size, paneltype, ac, userid, areaid];

//         await db.query(sql, values);
//         return res.sendStatus(200);
//     }
//     catch (err) {
//         return res.sendStatus(500);
//     }
// }