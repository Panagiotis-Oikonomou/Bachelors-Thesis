const db = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const sql = "SELECT userid, fname, lname, clock, provider, email, username FROM users ORDER BY username";

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
        const sqlArea = "DELETE FROM areas WHERE userid = ?";
        const sqlCriteria = "DELETE FROM criterias WHERE userid = ?";
        const sqlNotification = "DELETE FROM notifications WHERE userid = ?";
        const userid = req.params.userid;

        await db.query(sql, [userid]);
        await db.query(sqlArea, [userid]);
        await db.query(sqlCriteria, [userid]);
        await db.query(sqlNotification, [userid]);
        return res.sendStatus(200);
    }
    catch(err){
        return res.status(500).json({err});
    }
}

exports.deleteProvider = async (req, res) => {
    try{
        const sql = "DELETE FROM providers WHERE providerid = ?";
        const sqlProviderId = "SELECT providername FROM providers WHERE providerid = ?";
        const sqlUpdate = "UPDATE users SET provider = '' WHERE provider = ?";
        const id = req.params.providerid;

        const [result] =  await db.query(sqlProviderId, [id]);
        if (result.length === 0) return res.sendStatus(404);

        await db.query(sql, [id]);
        await db.query(sqlUpdate, [result[0].providername]);
        return res.sendStatus(200);
    }
    catch(err){
        return res.status(500).json({err});
    }
}

exports.addProvider = async (req, res) => {
    try{
        const sql = "INSERT INTO providers (providername) VALUES (?)";
        const provider = req.body.providername;
        await db.query(sql, [provider]);
        return res.sendStatus(200);
    }
    catch(err){
        return res.status(500).json({err});
    }
}