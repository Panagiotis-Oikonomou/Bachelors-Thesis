const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');

const generateAccessToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin, jti:crypto.randomUUID() }, process.env.SECRET_JWT_KEY, { expiresIn: "10s" });
}

const generateRefreshToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin, jti:crypto.randomUUID() }, process.env.SECRET_REFRESH_JWT_KEY, {expiresIn: '15m'});
}

const storeRefreshTokens = async (token, id) => {
    try{
        const sql = "INSERT INTO refresh_tokens (userid, refresh_token, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE))";

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        await db.query(sql, [id, hashedToken]);
    }
    catch(err){
        console.error(err);
    }
}

const removeRefreshToken = async (id, token) => {
    try{
        const sql = "DELETE FROM refresh_tokens WHERE userid = ? AND refresh_token = ?";

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        await db.query(sql, [id, hashedToken]);
    }
    catch(err){
        console.error(err);
    }
}

const hasRefreshToken = async (id, token) => {
    try{
        const sql = "SELECT 1 FROM refresh_tokens WHERE userid = ? AND refresh_token = ? AND expires_at > UTC_TIMESTAMP() LIMIT 1";

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const [result] = await db.query(sql, [id, hashedToken]);

        return result.length > 0;
    }
    catch(err){
        console.error(err);
        return false;
    }
};

const removeAllUserTokens = async (id) => {
    try{
        const sql = "DELETE FROM refresh_tokens WHERE userid = ?";

        await db.query(sql, [id]);
    }
    catch(err){
        console.error(err);
    }
};

const findUserByRefreshToken = async (token) => {
    try{
        const sql = "SELECT userid FROM refresh_tokens WHERE refresh_token = ? AND expires_at > UTC_TIMESTAMP() LIMIT 1";

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const [result] = await db.query(sql, [hashedToken]);
        
        if(result.length > 0) return result[0].userid;

        return null;
    }
    catch(err){
        console.error(err);
        return null;
    }
};

const showTokens = async () => {
    try{
        const sql = "SELECT refresh_token, userid, expires_at FROM refresh_tokens";

        const [rows] = await db.query(sql);

        for(const row of rows){
            console.log(`id: ${row.userid} and rt: ${row.refresh_token}, expires at: ${row.expires_at}`);
        }
    }
    catch(err){
        console.error(err);
    }
}

const clearRefreshCookie = (res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false});
}

const setRefreshCookie = (res, rt) => {
    res.cookie('jwt', rt, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 24 * 60 * 60 * 1000 });
}

module.exports = {
    generateAccessToken, generateRefreshToken,
    storeRefreshTokens, removeRefreshToken, showTokens,
    hasRefreshToken, removeAllUserTokens,
    clearRefreshCookie, setRefreshCookie, findUserByRefreshToken
}