const express = require("express");
const cors = require("cors");
const path = require("path");


const userRoutes = require("./routes/userRoutes");
const pvRoutes = require("./routes/pvRoutes");
const areaRoutes = require("./routes/areaRoutes");
const providerRoutes = require("./routes/providerRoutes");
const validationRoutes = require("./routes/validationRoutes");
const tokenServiceRoutes = require('./routes/tokenServiceRoutes');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pv", pvRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/refresh", tokenServiceRoutes);

module.exports = app;