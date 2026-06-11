const db = require('../config/db');

exports.addCriteria = async (userid) => {
    const sql = "INSERT INTO criterias (userid) VALUES (?)";
    await db.query(sql, [userid]);
}