const db = require('../config/db');

exports.addArea = async (req, res) => {
    try {
        const sql = "INSERT INTO areas (userid, name, size, lat, lng,  ac) VALUES (?, ?, ?, ?, ?, ?)";
        const { size, lat, lng, ac, name } = req.body;
        const userid = req.user.id;
        const values = [userid, name, size, lat, lng, ac];

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

exports.updateArea = async (req, res) => {
    try {
        const sql = "UPDATE areas SET name = ?, size = ?, ac = ? WHERE userid = ? AND areaid = ?";
        const userid = req.user.id;
        const areaid = req.params.id;
        const { name, size, ac } = req.body;
        const values = [name, size, ac, userid, areaid];

        await db.query(sql, values);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}

exports.getAreaCoordinates = async (req, res) => {
    try {
        const sql = "SELECT a.lat, a.lng FROM areas a JOIN chats c ON a.areaid = c.areaid WHERE chatid = ?";
        const chatid = req.params.chatid;

        const [rows] = await db.query(sql, [chatid]);
        if (rows.length === 0) return res.status(404).json({ message: "Coordinates not found" });
        return res.json(rows[0]);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}