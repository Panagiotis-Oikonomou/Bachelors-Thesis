const db = require('../config/db');

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
        await db.query(sql, [userid]);
        return res.sendStatus(200);
    }
    catch(err){
        return res.status(500).json({err});
    }
}

exports.deleteProvider = async (req, res) => {
    try{
        const sql = "DELETE FROM providers WHERE providerid = ?";
        const id = req.params.providerid;
        await db.query(sql, [id]);
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