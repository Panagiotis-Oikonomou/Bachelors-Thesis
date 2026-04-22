// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// // const mysql = require('mysql2');
// const axios = require('axios');

// const app = express();
// // to serve static files, to handle client side assets like css and javascript
// app.use(express.static(path.join(__dirname, "public")));
// // to manage and control security
// app.use(cors());
// // to parse data that we get from the client
// app.use(express.json());
// const port = 5000;

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "energy_community"
// }).promise();

// app.post('/register', async (req, res) => {
//     try {
//         const sql = "INSERT INTO users (fname, lname, clock, provider, email, username,  password) VALUES (?, ?, ?, ?, ?, ?, ?)";
//         const values = [
//             req.body.fname,
//             req.body.lname,
//             req.body.clock,
//             req.body.provider,
//             req.body.email,
//             req.body.username,
//             req.body.password
//         ];

//         await db.query(sql, values);
//         res.status(201).json({ message: "User added successfully" });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong register" });
//     }
// });

// app.get('/check_username/:username', async (req, res) => {
//     try {
//         const sql = "SELECT username FROM users WHERE `username`=?";
//         const username = req.params.username;

//         const [rows] = await db.query(sql, [username]);
//         res.json({ exists: rows.length > 0 });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong username" });
//     }
// });

// app.get('/check_email/:email', async (req, res) => {
//     try {
//         const sql = "SELECT 1 FROM users WHERE `email`=? LIMIT 1";
//         const email = req.params.email;

//         const [rows] = await db.query(sql, [email]);
//         res.json({ exists: rows.length > 0 });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong email" });
//     }
// });

// app.get('/check_clock/:clock', async (req, res) => {
//     try {
//         const sql = "SELECT 1 FROM users WHERE `clock`=? LIMIT 1";
//         const clock = req.params.clock;

//         const [rows] = await db.query(sql, [clock]);

//         res.json({ exists: rows.length > 0 });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong clock" });
//     }
// });

// app.get('/check_clock_profile/', async (req, res) => {
//     try {
//         const sql = "SELECT userid FROM users WHERE `clock` = ?";
//         const clock = req.query.clock;
//         const id = req.query.id;

//         const [rows] = await db.query(sql, [clock]);

//         if (rows.length === 0) return res.json({ exists: false });
//         if (rows[0].userid == id) { return res.json({ exists: false }); }

//         return res.json({ exists: true });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong clock profile" });
//     }
// });

// app.get('/check_username_profile/', async (req, res) => {
//     try {
//         const sql = "SELECT userid FROM users WHERE `username` = ?";
//         const username = req.query.username;
//         const id = req.query.id;

//         const [rows] = await db.query(sql, [username]);

//         if (rows.length === 0) return res.json({ exists: false });
//         if (rows[0].userid == id) return res.json({ exists: false });

//         return res.json({ exists: true });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong username profile" });
//     }
// });

// app.get('/check_email_profile/', async (req, res) => {
//     try {
//         const sql = "SELECT userid FROM users WHERE `email` = ?";
//         const email = req.query.email;
//         const id = req.query.id;

//         const [rows] = await db.query(sql, [email]);

//         if (rows.length === 0) return res.json({ exists: false });
//         if (rows[0].userid == id) return res.json({ exists: false });

//         return res.json({ exists: true });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong email profile" });
//     }
// });

// app.get('/get_password_profile/', async (req, res) => {
//     try {
//         const sql = "SELECT userid FROM users WHERE `password` = ?";
//         const password = req.query.password;
//         const id = req.query.id;

//         const [rows] = await db.query(sql, [password]);

//         // if (rows.length === 0) return res.json({ exists: false });
//         if (rows.length != 0) return res.json({ exists: rows[0].userid == id })
//         // if (rows[0].userid == id) return res.json({ exists: true });

//         // return res.json({ exists: true });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong password profile" });
//     }
// });

// app.get('/get_providers', async (req, res) => {
//     try {
//         const sql = "SELECT * FROM providers";
//         const [rows] = await db.query(sql);
//         res.json(rows);
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong get providers" });
//     }
// });

// app.put('/edit_user/:id', async (req, res) => {
//     try {
//         const sql = "UPDATE users SET `fname`=?, `lname`=?, `clock`=?, `provider`=?, `email`=?, `username`=?, `password`=? WHERE `userid`=?";
//         const values = [
//             req.body.fname,
//             req.body.lname,
//             req.body.clock,
//             req.body.provider,
//             req.body.email,
//             req.body.username,
//             req.body.password,
//             req.params.id
//         ];
//         await db.query(sql, values);
//         res.json({ values });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong edit user" });
//     }
// });

// app.get('/user_profile/:id', async (req, res) => {
//     try {
//         const sql = "SELECT * FROM users WHERE `userid`=?";
//         const id = req.params.id;

//         const [rows] = await db.query(sql, [id]);
//         res.json(rows[0] || null);
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong get profile" });
//     }
// });

// app.post('/login/', async (req, res) => {
//     try {
//         const sql = "SELECT 1 FROM users WHERE `username`=? AND `password`=? LIMIT 1";
//         const usr = req.body.usr;
//         const psw = req.body.psw;

//         const [rows] = await db.query(sql, [usr, psw]);
//         if (rows.length === 0) return res.json({ exists: false });
//         return res.json({ exists: true });
//     }
//     catch (err) { return res.status(500).json({ error: "Wrong login" }); }
// });

// app.get('/pvcalc', async (req, res) => {
//     const { lat, lon, type } = req.query;
//     if(type == 1){
//         try {
//             const response = await axios.get(
//                 `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&vertical_axis=1&vertical_optimum=1&outputformat=json`
//             );

//             value = response.data?.outputs?.totals?.vertical_axis?.["H(i)_y"];
//             res.json(value ?? null);
//         } catch (err) {
//             console.error("PVcalc API error:", err.response?.status, err.response?.data || err.message);
//             res.status(500).json({ error: "PV API failed" });
//         }
//     }
//     else if(type == 2){
//         try {
//             const response = await axios.get(
//                 `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&inclined_axis=1&inclined_optimum=1&outputformat=json`
//             );

//             value = response.data?.outputs?.totals?.inclined_axis?.["H(i)_y"];
//             res.json(value ?? null);
//         } catch (err) {
//             console.error("PVcalc API error:", err.response?.status, err.response?.data || err.message);
//             res.status(500).json({ error: "PV API failed" });
//         }
//     }
//     else if (type == 3) {
//         try {
//             const response = await axios.get(
//                 `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&twoaxis=1&outputformat=json`
//             );

//             value = response.data?.outputs?.totals?.two_axis?.["H(i)_y"];
//             res.json(value ?? null);
//         } catch (err) {
//             console.error("PVcalc API error:", err.response?.status, err.response?.data || err.message);
//             res.status(500).json({ error: "PV API failed" });
//         }
//     }

// });

// app.post('/addArea', async (req, res) => {
//     try {
//         const sql = "INSERT INTO areas (userid, name, size, paneltype, lat, lng,  ac) VALUES (?, ?, ?, ?, ?, ?, ?)";
//         const {userid, size, paneltype, lat, lng, ac, name} = req.body;
//         const values = [userid, name, size, paneltype, lat, lng, ac];

//         await db.query(sql, values);
//         res.status(201).json({ message: "Area added successfully" });
//     }
//     catch (err) {
//         return res.status(500).json({ error: "Wrong addArea" });
//     }
// });
require("dotenv").config();
const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});