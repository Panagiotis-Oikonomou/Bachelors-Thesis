const db = require('../config/db');

exports.addCriteria = async (userid) => {
    const sql = "INSERT INTO criterias (userid) VALUES (?)";
    await db.query(sql, [userid]);
}

exports.updateCriteria = async (req, res) => {
    try{
        const sql = "UPDATE criterias SET areaid = ?, minsize = ?, maxsize = ?, minenergy = ?, maxenergy = ?, minincome = ?, maxincome = ?, money = ?, papers = ?, other = ? WHERE userid = ?";
        const values = [
            req.body.areaid,
            req.body.minsize,
            req.body.maxsize,
            req.body.minenergy,
            req.body.maxenergy,
            req.body.minincome,
            req.body.maxincome,
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
        return res.json(rows[0] ?? null);
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}