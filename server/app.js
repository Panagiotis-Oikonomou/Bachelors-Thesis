const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/public", require('./routes/publicRoutes'));

app.use("/api/users", require('./routes/userRoutes'));
app.use("/api/pv", require('./routes/pvRoutes'));
app.use("/api/areas", require('./routes/areaRoutes'));
app.use("/api/providers", require('./routes/providerRoutes'));
app.use("/api/validate", require('./routes/validationRoutes'));
app.use("/api/refresh", require('./routes/refreshTokenRoutes'));

module.exports = app;