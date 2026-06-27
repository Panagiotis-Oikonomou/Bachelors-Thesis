const db = require('../config/db');

exports.getMatches = async (req, res) => {
    try {
        const { area, size, energy, income, money, papers, other } = req.body;
        let sql = "SELECT c.*, u.username FROM users u JOIN criterias c ON u.userid = c.userid ";
        const values = [req.user.id];

        if (area) sql += "WHERE c.areaid IS NULL AND u.userid != ? ";

        else {
            sql += "JOIN areas a ON c.areaid = a.areaid WHERE c.areaid IS NOT NULL AND u.userid != ? ";

            if (size !== false) {
                sql += "AND a.size >= ? ";
                values.push(size);
            }

            if (energy !== false) {
                sql += "AND a.ac >= ? ";
                values.push(energy);
            }
        }

        // if (minincome !== false && maxincome !== false) {
        //     sql += "AND c.minincome <= ? AND c.maxincome <= ? ";
        //     values.push(minincome, maxincome);
        // }

        if (money !== false) {
            sql += "AND c.money >= ? ";
            values.push(money);
        }

        if (papers) sql += "AND c.papers = 1 ";
        if (other) sql += "AND c.other = 1";

        // console.log(sql);
        // console.log(values);
        // console.log(values.length);

        const [rows] = await db.query(sql, values);
        console.log(rows.length);

        return res.json(rows);
    }
    catch (err) {
        return res.sendStatus(500);
    }
}