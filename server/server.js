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

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});