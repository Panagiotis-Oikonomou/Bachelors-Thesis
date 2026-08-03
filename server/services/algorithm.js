const db = require('../config/db');
const uuid = require("crypto");

const getAllUsers = async () => {
    const getUsersWithFieldSql = "SELECT c.*, a.size, a.ac FROM criterias c JOIN areas a ON c.areaid = a.areaid WHERE c.areaid IS NOT NULL AND c.income IS NOT NULL";
    const getUsersWithoutFieldSql = "SELECT * FROM criterias WHERE areaid IS NULL AND (areasize IS NOT NULL OR energy IS NOT NULL OR income IS NOT NULL OR money IS NOT NULL OR papers IS NOT NULL OR other IS NOT NULL ) AND (areasize IS NULL OR areasize <= ?) AND (energy IS NULL OR energy <= ?)";

    let teams = [];

    const [userFields] = await db.query(getUsersWithFieldSql);
    if(userFields.length === 0) return;
    for (const user of userFields) {
        const [userNOFields] = await db.query(getUsersWithoutFieldSql, [user.size, user.ac]);
        const team = generateTeam(userNOFields, user);
        if (team.length >= 5) {
            teams.push(team);
        }
    }

    let tempTeams = teams.map(team => team.slice(1));
    let tempIds = [];
    let index = 0;
    for (const tempTeam of tempTeams) {
        let id = 0;
        let stringId = "";
        tempTeam.sort((a, b) => { return a.userid - b.userid });
        for (const member of tempTeam) {
            id += member.userid;
            stringId += member.userid;
        }
        tempIds.push({ id, stringId, index });
        index++;
    }

    for (let i = 0; i < tempIds.length; i++) {
        let dublicates = tempIds.filter(t => t.id === tempIds[i].id && t.stringId === tempIds[i].stringId);
        if (dublicates.length > 1) {
            let best = dublicates[0];
            for (const d of dublicates) {
                const field = teams[d.index][0];
                if (field.ac > teams[best.index][0].ac || (field.ac === teams[best.index][0].ac && field.size === teams[best.index][0].size))
                    best = d;
            }
            tempIds = tempIds.filter(t => (t.id !== best.id && t.stringId !== best.stringId) || t.index === best.index);
        }
    }

    teams = teams.filter(((_, index) => tempIds.some(t => t.index === index)));
    for (const team of teams) {
        let id = "";
        let sum = 0;
        let areaid = team[0].areaid;
        team.sort((a, b) => { return a.userid - b.userid });
        for (const member of team) {
            id += member.userid;
            sum += Number(member.userid);
        }

        const checkIdSql = "SELECT id FROM algo_group WHERE id = ? AND sumid = ? LIMIT 1";
        const [rows] = await db.query(checkIdSql, [id, sum]);
        if (rows.length > 0) continue; 

        const newGroupSql = "INSERT INTO groups VALUES ()";
        const createAlgoGroupSql = "INSERT INTO algo_group (groupid, userid, id, sumid) VALUES (?, ?, ?, ?)";
        const createChatGroupSql = "INSERT INTO chats (groupid, areaid, chat_name) VALUES (?, ?, ?)";
        const insertChatUserSql = "INSERT INTO chat_users (chatid, userid) VALUES (?, ?)";
        const createDestroySql = "INSERT INTO waiting_deleted_chats (chatid, userid) VALUE (?, ?)";
        const createOfflineMessagesSql = "INSERT INTO offline_chat (chatid, userid) VALUE (?, ?)";
        const createNotificationSql = "INSERT INTO notifications (userid, groupid, message, type) VALUE (?, ?, ?, ?)";

        const [groupid] = await db.query(newGroupSql);
        const chatName = crypto.randomUUID().slice(0, 10);
        const message = `Ο αλγόριθμός μας σας ταίριαξε με άλλους χρήστες. Μπορείτε να επικοινωνήσετε μαζί τους στο chat ${chatName}`;
        const [chatid] = await db.query(createChatGroupSql, [groupid.insertId, areaid, chatName]);

        for (const member of team) {
            await db.query(createAlgoGroupSql, [groupid.insertId, member.userid, id, sum]);
            await db.query(insertChatUserSql, [chatid.insertId, member.userid]);
            await db.query(createDestroySql, [chatid.insertId, member.userid]);
            await db.query(createOfflineMessagesSql, [chatid.insertId, member.userid]);
            await db.query(createNotificationSql, [member.userid, groupid.insertId, message, "info"]);
        }
    }
    return;
}

function generateTeam(users, userWithArea) {
    shuffle(users);

    let team = [];
    team.push(userWithArea);

    let totalIncome = Number(userWithArea.income);
    const needed = { money: userWithArea.money !== null, papers: userWithArea.papers === 1, other: userWithArea.other === 1 };

    while (true) {
        if (isValidTeam(team, totalIncome, needed)) break;

        let bestUser = null;
        let bestScore = -Infinity;

        for (const user of users) {
            if (team.includes(user)) continue;

            let score = 0;
            score += incomeScore(user, totalIncome);
            score += moneyScore(user);
            score += papersScore(user, needed);
            score += otherScore(user, needed);

            if (score > bestScore) {
                bestScore = score;
                bestUser = user;
            }
        }
        if (bestUser === null) break;

        if (bestScore < 0 && needed.money && needed.papers && needed.other) break;

        team.push(bestUser);
        if (bestUser.money !== null) needed.money = true;

        if (bestUser.papers === 1) needed.papers = true;

        if (bestUser.other === 1) needed.other = true;

        if (bestUser?.income) totalIncome += Number(bestUser.income);
    }
    if (totalIncome > 100) return null;
    return team;
}

function isValidTeam(team, totalIncome, needed) {
    if (team.length < 5) return false;

    if (totalIncome > 100 || totalIncome <= 85) return false;

    if (!needed.money || !needed.papers || !needed.other) return false;
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function incomeScore(user, totalIncome) {
    if (!user.income) return -10;

    let total = totalIncome + Number(user.income);

    if (total > 100) return -10000;

    return Math.abs(92 - total);
}

function moneyScore(user) {
    if (user.money !== null) return 0;
    const money = Number(user.money);

    if (money >= 10000) return 40;
    else if (money >= 5000) return 20;
    else if (money >= 1000) return 10;

    return 5;
}

function papersScore(user, needed) {
    if (needed.papers) return 0;
    return user.papers === 1 ? 25 : 0;
}

function otherScore(user, needed) {
    if (needed.other) return 0;
    return user.other === 1 ? 25 : 0;
}

module.exports = {
    getAllUsers
}