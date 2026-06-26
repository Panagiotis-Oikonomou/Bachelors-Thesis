const db = require('../config/db');

exports.getMatches = async (req, res) => {
    try {
        const { area, minsize, maxsize, minenergy, maxenergy, minincome, maxincome, minmoney, maxmoney, papers, other } = req.body;
        let sql = "SELECT c.*, u.username FROM users u JOIN criterias c ON u.userid = c.userid ";
        const values = [req.user.id];

        if (area) sql += "WHERE c.areaid IS NULL AND u.userid != ? ";

        else {
            sql += "JOIN areas a ON c.areaid = a.areaid WHERE c.areaid IS NOT NULL AND u.userid != ? ";

            if (minsize !== false && maxsize !== false) {
                sql += "AND a.size >= ? AND a.size <= ? ";
                values.push(minsize, maxsize);
            }

            if (minenergy !== false && maxenergy !== false) {
                sql += "AND a.ac >= ? AND a.ac <= ? ";
                values.push(minenergy, maxenergy);
            }
        }

        // if (minincome !== false && maxincome !== false) {
        //     sql += "AND c.minincome <= ? AND c.maxincome <= ? ";
        //     values.push(minincome, maxincome);
        // }

        if (minmoney !== false && maxmoney !== false) {
            sql += "AND c.money >= ? AND c.money <= ? ";
            values.push(minmoney, maxmoney);
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