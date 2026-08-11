const db = require('../config/db');
const { getAllUsers } = require('../services/algorithm');

exports.addCriteria = async (userid) => {
    const sql = "INSERT INTO criterias (userid) VALUES (?)";
    await db.query(sql, [userid]);
}

exports.updateCriteria = async (req, res) => {
    try{
        const sql = "UPDATE criterias SET areaid = ?, areasize = ?, energy = ?, income = ?, money = ?, papers = ?, other = ? WHERE userid = ?";
        const values = [
            req.body.send.areaid,
            req.body.send.size,
            req.body.send.energy,
            req.body.send.income,
            req.body.send.money,
            req.body.send.papers,
            req.body.send.other,
            req.user.id
        ];
        const {onlineUsers} = req.body;
        await db.query(sql, values);
        const not = await getAllUsers(onlineUsers);
        return res.status(200).json(not);
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