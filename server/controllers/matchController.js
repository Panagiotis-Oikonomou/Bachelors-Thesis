const db = require('../config/db');

exports.getMatches = async (req, res) => {
    try {
        const { size, energy, income, money, papers, other } = req.body;
        let sql = "SELECT c.*, u.username, a.size, a.ac FROM users u JOIN criterias c ON u.userid = c.userid LEFT JOIN areas a ON u.userid = a.userid WHERE u.userid != ? ";
        const values = [req.user.id];

        if (size !== false) {
            sql += "AND a.size >= ? ";
            values.push(size);
        }

        if (energy !== false) {
            sql += "AND a.ac >= ? ";
            values.push(energy);
        }

        if (income !== false) {
            sql += "AND c.income >= ? ";
            values.push(income);
        }

        if (money !== false) {
            sql += "AND c.money >= ? ";
            values.push(money);
        }

        if (papers) sql += "AND c.papers = 1 ";
        if (other) sql += "AND c.other = 1";

        const [rows] = await db.query(sql, values);

        return res.json(rows);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}