// npm run dev to start the development
const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');

app = express();
// to serve static files, to handle client side assets like css and javascript
app.use(express.static(path.join(__dirname, "public")));
// to manage and control security
app.use(cors());
// to parse data that we get from the client
app.use(express.json());
const port = 5000;

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"energy_community"
});

app.get('/', (req, res)=>{
    res.send("Hello");
});

app.post('/register', (req, res)=>{
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
    db.query(sql, values, (err, result)=>{
        if(err){
            console.log(err.message);
            return res.json({message:"Something happend with MySQL"});
        }
        // console.log(values);
        return res.json({success:"Success"});
    });
});

app.get('/check_username/:username', (req, res) => {
    const sql = "SELECT username FROM users WHERE `username` = ?";

    const username = req.params.username;

    db.query(sql, [username], (err, result) => {
        if(err) return res.json(err);

        return res.json({exists: result.length > 0});
    });
});

app.get('/check_email/:email', (req, res)=>{
    const sql = "SELECT email FROM users WHERE `email` = ?";
    const email = req.params.email;

    db.query(sql, [email], (err, result) => {
        if(err) return res.json(err);
        return res.json({exists: result.length > 0});
    });
})

app.get('/check_clock/:clock', (req, res) => {
    const sql = "SELECT clock FROM users WHERE `clock` = ?";
    const clock = req.params.clock;

    db.query(sql, [clock], (err, result) => {
        if(err) return res.json(err);
        return res.json({exists: result.length > 0});
    });
});

app.get('/get_providers', (req, res)=>{
    const sql = "SELECT * FROM providers";

    db.query(sql, (err, result)=>{
        if(err){
            console.log(err.message);
            return res.status(500).json({message:"Server error"});
        }
        res.json(result);
    });
});


app.put('/edit_user/:id', (req, res)=>{
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
    db.query(sql, values, (err, result)=>{
        if(err) return res.json({message:"Something happend with MySQL"});
        return res.json({values});
    });
});

app.get(('/user_profile/:id'), (req, res)=>{
    const sql = "SELECT * FROM users WHERE `userid` = ?";
    const user_id = req.params.id;

    db.query(sql, [user_id], (err, result)=>{
        if(err) return res.status(500).json({message:"Server error"});
        res.json(result);
    });
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});