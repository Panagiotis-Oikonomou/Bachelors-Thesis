const db = require('../config/db');

exports.addArea = async (req, res) => {
    try {
        const sql = "INSERT INTO areas (userid, name, size, paneltype, lat, lng,  ac) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const { size, paneltype, lat, lng, ac, name } = req.body;
        const userid = req.user.id;
        const values = [userid, name, size, paneltype, lat, lng, ac];

        await db.query(sql, values);
        res.sendStatus(201);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.getAreas = async (req, res) => {
    try {
        const sql = "SELECT * FROM areas WHERE userid = ?";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.getArea = async (req, res) => {
    try {
        const sql = "SELECT * FROM areas WHERE userid = ? AND areaid = ?";
        const userid = req.user.id;
        const areaid = req.params.id;

        const [rows] = await db.query(sql, [userid, areaid]);
        if (rows.length === 0) return res.status(404).json({ message: "Area not found" });
        return res.json(rows[0]);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.deleteArea = async (req, res) => {
    try {
        const sql = "DELETE FROM areas WHERE areaid = ?";
        const id = req.params.id;

        await db.query(sql, [id]);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}