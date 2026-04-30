const db = require('../config/db');

exports.addArea = async (req, res) => {
    try {
        const sql = "INSERT INTO areas (userid, name, size, paneltype, lat, lng,  ac) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const {size, paneltype, lat, lng, ac, name} = req.body;
        const userid = req.user.id;
        const values = [userid, name, size, paneltype, lat, lng, ac];

        await db.query(sql, values);
        res.status(201).json({ message: "Area added successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong addArea" });
    }
}