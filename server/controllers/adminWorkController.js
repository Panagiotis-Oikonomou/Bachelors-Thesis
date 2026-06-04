const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
    try {
        const sql = "SELECT userid, fname, lname, clock, provider, email, username FROM users";

        const [rows] = await db.query(sql);
        res.json(rows);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong get users" });
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const sql = "DELETE FROM users WHERE userid = ?";
        const userid = req.params.userid;
        console.log('deleted');
        console.log(userid);
        await db.query(sql, [userid]);
        return res.sendStatus(200);
    }
    catch(err){
        return res.status(500).json({err});
    }
}