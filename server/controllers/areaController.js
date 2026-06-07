const db = require('../config/db');

exports.addArea = async (req, res) => {
    try {
        const sql = "INSERT INTO areas (userid, name, size, paneltype, lat, lng,  ac) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const {size, paneltype, lat, lng, ac, name} = req.body;
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
    try{
        const sql = "SELECT * FROM areas WHERE userid = ?";
        const id = req.user.id;

        const [rows] = await db.query(sql, [id]);
        return res.json(rows);
    }
    catch(err){
        return res.sendStatus(500);
    }
}