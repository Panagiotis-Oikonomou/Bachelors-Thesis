const db = require('../config/db');

const getAllUsers = async (onlineUsers) => {
    const getUsersWithFieldSql = "SELECT c.*, a.size, a.ac, u.username FROM criterias c JOIN areas a ON c.areaid = a.areaid JOIN users u ON u.userid = a.userid WHERE c.areaid IS NOT NULL AND c.income IS NOT NULL AND NOT EXISTS (SELECT 1 FROM chat_users cu WHERE c.userid = cu.userid)";
    const getUsersWithoutFieldSql = "SELECT c.*, u.username FROM criterias c JOIN users u ON c.userid = u.userid WHERE c.areaid IS NULL AND (c.areasize IS NOT NULL OR c.energy IS NOT NULL OR c.income IS NOT NULL OR c.money IS NOT NULL OR c.papers IS NOT NULL OR c.other IS NOT NULL) AND (c.areasize IS NULL OR c.areasize <= ?) AND (c.energy IS NULL OR c.energy <= ?)";

    let teams = [];

    const [userFields] = await db.query(getUsersWithFieldSql);
    if (userFields.length === 0) return [];
    for (const user of userFields) {
        const [userNOFields] = await db.query(getUsersWithoutFieldSql, [user.size, user.ac]);
        const team = generateTeam(userNOFields, user);
        if (team && team.length >= 5) {
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
    const not = [];
    for (const team of teams) {
        let areaid = team[0].areaid;
        const areaDataSql = "SELECT name, size, lat, lng, ac FROM areas WHERE areaid = ?";
        const [area] = await db.query(areaDataSql, [areaid]);
        let message = "Ο αλγόριθμός μας σας ταίριαξε με άλλους χρήστες με τα εξής προνόμοια:\n\n";
        message += `Χαρακτηριστικά περιοχής:\n`;
        message += `Όνομα: ${area[0].name}\n`;
        message += `Μέγεθος έκτασης: ${area[0].size}m²\n`;
        message += `Γεωγραφικό πλάτος: ${area[0].lat}\n`;
        message += `Γεωγραφικό μήκος: ${area[0].lng}\n`;
        message += `Ποσότητα ηλεκτρικής ενέργειας: ${area[0].ac}(kWh/year)\n\n`;

        const essentialsSql = "SELECT money FROM criterias WHERE userid = ?";
        let money = 0;
        for (const user of team) {
            const [essentialsRows] = await db.query(essentialsSql, [user.userid]);
            if (essentialsRows[0]?.money !== null) money += Number(essentialsRows[0].money);
        }

        message += `Προσφέρονται συνολικά ${money}€ μαζί με κάποιον για τα διαδικαστικά ή και άλλες ενέργειες.\n\n`;
        message += "Τι ζητάει ο κάθε χρήστης:\n";

        const userCriteriaSql = "SELECT areasize, energy, income FROM criterias WHERE userid = ?";
        for (const user of team) {
            const [userCriteriaRows] = await db.query(userCriteriaSql, [user.userid]);
            message += `${user.username}\n`;
            if (userCriteriaRows[0]?.areasize !== null) message += `Ελάχιστη έκταση περιοχής: ${Math.round(userCriteriaRows[0].areasize)}m²\n`;
            if (userCriteriaRows[0]?.energy !== null) message += `Ελάχιστη ποσότητα ηλεκτρικής ενέργειας: ${userCriteriaRows[0].energy}kwy\n`;
            if (userCriteriaRows[0]?.income !== null) message += `Ελάχιστο ποσό εσόδων: ${Math.round(userCriteriaRows[0].income)}%\n`;
            message += '\n';
        }

        let id = "";
        let sum = 0;
        team.sort((a, b) => { return a.userid - b.userid });
        for (const member of team) {
            id += member.userid;
            sum += Number(member.userid);
        }

        const checkIdSql = "SELECT id FROM algo_group WHERE id = ? AND sumid = ? LIMIT 1";
        const [rows] = await db.query(checkIdSql, [id, sum]);
        if (rows.length > 0) continue;

        const newGroupSql = "INSERT INTO groups VALUES ()";
        const potentialAreaIdSql = "INSERT INTO potential_areaid (groupid, areaid) VALUES (?, ?)";
        const createMatchings = "INSERT INTO matchings (groupid, userid) VALUES (?, ?)";
        const createAlgoGroupSql = "INSERT INTO algo_group (groupid, id, sumid) VALUES (?, ?, ?)";
        const createNotificationSql = "INSERT INTO notifications (userid, groupid, message, type) VALUE (?, ?, ?, ?)";

        const [groupid] = await db.query(newGroupSql);
        await db.query(createAlgoGroupSql, [groupid.insertId, id, sum]);
        await db.query(potentialAreaIdSql, [groupid.insertId, areaid]);
        for (const member of team) {
            await db.query(createMatchings, [groupid.insertId, member.userid]);
            const [notResult] = await db.query(createNotificationSql, [member.userid, groupid.insertId, message, "conf"]);
            if (onlineUsers.some(o => o.userId === member.userid)) {
                not.push({
                    notid: notResult.insertId,
                    userid: member.userid,
                    groupid: groupid.insertId,
                    message: message,
                    type: "conf",
                    is_read: 0,
                    disabled: 0,
                    expanded: false
                });
            }
        }
    }
    return not;
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