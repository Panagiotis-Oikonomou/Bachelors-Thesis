// npm run dev to start the development
const express = require('express');
// const promise = require('promises');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');

app = express();
// to serve static files, to handle client side assets like css and javascript
app.use(express.static(path.join(__dirname, "public")));
// to manage and control security
app.use(cors());
// to parse data that we get from the client
app.use(express.json());
const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "energy_community"
}).promise();


app.post('/register', async (req, res) => {
    try {
        const sql = "INSERT INTO users (fname, lname, clock, provider, email, username,  password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.clock,
            req.body.provider,
            req.body.email,
            req.body.username,
            req.body.password
        ];

        await db.query(sql, values);
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong register" });
    }
});

app.get('/check_username/:username', async (req, res) => {
    try {
        const sql = "SELECT username FROM users WHERE `username`=?";
        const username = req.params.username;

        const [rows] = await db.query(sql, [username]);
        res.json({exists: rows.length > 0});
    }
    catch (err) {
        return res.status(500).json({ error: "Wrong username" });
    }
});

app.get('/check_email/:email', async (req, res) => {
    try {
        const sql = "SELECT 1 FROM users WHERE `email`=? LIMIT 1";
        const email = req.params.email;

        const [rows] = await db.query(sql, [email]);
        res.json({ exists: rows.length > 0 });
    }
    catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.status(500).json({ error: "Wrong email" });
    }
})

app.get('/check_clock/:clock', async (req, res) => {
    try {
        const sql = "SELECT 1 FROM users WHERE `clock`=? LIMIT 1";
        const clock = req.params.clock;

        const [rows] = await db.query(sql, [clock]);

        res.json({ exists: rows.length > 0 });
    }
    catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.status(500).json({ error: "Wrong clock" });
    }
});

app.get('/check_clock_profile/', async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `clock` = ?";
        const clock = req.query.clock;
        const id = req.query.id;

        const [rows] = await db.query(sql, [clock]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) { console.log(rows[0].userid); return res.json({ exists: false }); }

        return res.json({ exists: true });
    }
    catch (err) {
        // return res.json(err);
        return res.status(500).json({ error: "Wrong clock profile" });
    }
});

app.get('/check_username_profile/', async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `username` = ?";
        const username = req.query.username;
        const id = req.query.id;

        const [rows] = await db.query(sql, [username]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) return res.json({ exists: false });

        return res.json({ exists: true });
    }
    catch (err) {
        // return res.json(err);
        return res.status(500).json({ error: "Wrong username profile" });
    }
});

app.get('/check_email_profile/', async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `email` = ?";
        const email = req.query.email;
        const id = req.query.id;

        const [rows] = await db.query(sql, [email]);

        if (rows.length === 0) return res.json({ exists: false });
        if (rows[0].userid == id) return res.json({ exists: false });

        return res.json({ exists: true });
    }
    catch (err) {
        // return res.json(err);
        return res.status(500).json({ error: "Wrong email profile" });
    }
});

app.get('/get_password_profile/', async (req, res) => {
    try {
        const sql = "SELECT userid FROM users WHERE `password` = ?";
        const password = req.query.password;
        const id = req.query.id;

        const [rows] = await db.query(sql, [password]);

        // if (rows.length === 0) return res.json({ exists: false });
        if(rows.length != 0) return res.json({exists: rows[0].userid == id})
        // if (rows[0].userid == id) return res.json({ exists: true });

        // return res.json({ exists: true });
    }
    catch (err) {
        // return res.json(err);
        return res.status(500).json({ error: "Wrong password profile" });
    }
});

app.get('/get_providers', async (req, res) => {
    try {
        const sql = "SELECT * FROM providers";
        const [rows] = await db.query(sql);
        res.json(rows);
    }
    catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.status(500).json({ error: "Wrong get providers" });
    }
});

app.put('/edit_user/:id', async (req, res) => {
    try {
        const sql = "UPDATE users SET `fname`=?, `lname`=?, `clock`=?, `provider`=?, `email`=?, `username`=?, `password`=? WHERE `userid`=?";
        const values = [
            req.body.fname,
            req.body.lname,
            req.body.clock,
            req.body.provider,
            req.body.email,
            req.body.username,
            req.body.password,
            req.params.id
        ];
        await db.query(sql, values);
        res.json({ values });
    }
    catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.status(500).json({ error: "Wrong edit user" });
    }
});

app.get('/user_profile/:id', async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE `userid`=?";
        const id = req.params.id;

        const [rows] = await db.query(sql, [id]);
        res.json(rows[0] || null);
    }
    catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.status(500).json({ error: "Wrong get profile" });
    }
});

app.get('/login/', async (req, res) => {
    try {
        const sql = "SELECT 1 FROM users WHERE `username`=? AND `password`=? LIMIT 1";
        const usr = req.query.usr;
        const psw = req.query.psw;

        const [rows] = await db.query(sql, [usr, psw]);
        if (rows.length === 0) return res.json({ exists: false });
        return res.json({ exists: true });
    }
    catch (err) {return res.status(500).json({ error: "Wrong login" });}
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});