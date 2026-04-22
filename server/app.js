const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const pvRoutes = require("./routes/pvRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pv", pvRoutes);

module.exports = app;