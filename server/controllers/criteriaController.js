const db = require('../config/db');

exports.addCriteria = async (userid) => {
    const sql = "INSERT INTO criterias (userid) VALUES (?)";
    await db.query(sql, [userid]);
}

exports.updateCriteria = async (req, res) => {
    try{
        const sql = "UPDATE criterias SET areaid = ?, areasize = ?, energy = ?, income = ?, money = ?, papers = ?, other = ? WHERE userid = ?";
        const values = [
            req.body.areaid,
            req.body.size,
            req.body.energy,
            req.body.income,
            req.body.money,
            req.body.papers,
            req.body.other,
            req.user.id
        ];

        await db.query(sql, values);
        return res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

exports.getCriteria = async (req, res) => {
    try{
        const sql = "SELECT c.*, a.name FROM criterias c LEFT JOIN areas a ON c.userid = a.userid WHERE c.userid = ?";
        const [rows] = await db.query(sql, [req.user.id]);
        return res.json(rows[0]);
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

exports.getMyOffers = async (req, res) => {
    try{
        const sql = "SELECT areaid, money, papers, other FROM criterias WHERE userid = ?";
        const [rows] = await db.query(sql, [req.user.id]);
        return res.json(rows[0]);
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}