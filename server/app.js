const express = require("express");
const cors = require("cors");
const path = require("path");


const userRoutes = require("./routes/userRoutes");
const pvRoutes = require("./routes/pvRoutes");
const areaRoutes = require("./routes/areaRoutes");
const providerRoutes = require("./routes/providerRoutes");
const validationRoutes = require("./routes/validationRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pv", pvRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/validate", validationRoutes);

module.exports = app;