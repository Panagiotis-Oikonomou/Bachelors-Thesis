const db = require('../config/db');

exports.getMatches = async (req, res) => {
    try {
        const { area, minsize, maxsize, minenergy, maxenergy, minincome, maxincome, minmoney, maxmoney, papers, other } = req.body;
        let usersAreaSql = "";
        
        if(area) usersAreaSql = "SELECT c.*, u.username FROM users u INNER JOIN criterias c ON u.userid = c.userid WHERE NOT EXISTS ( SELECT 1 FROM areas a WHERE u.userid = a.userid) AND u.userid != ?";

        else usersAreaSql = "SELECT c.*, u.username FROM users u INNER JOIN criterias c ON u.userid = c.userid WHERE EXISTS ( SELECT 1 FROM areas a WHERE u.userid = a.userid) AND u.userid != ?";

        const [rows] = await db.query(usersAreaSql, [req.user.id]);
        return res.json(rows ?? null);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}