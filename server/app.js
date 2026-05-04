const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
// const path = require("path");

// const publicRoutes = require('./routes/publicRoutes');
// const userRoutes = require("./routes/userRoutes");
// const pvRoutes = require("./routes/pvRoutes");
// const areaRoutes = require("./routes/areaRoutes");
// const providerRoutes = require("./routes/providerRoutes");
// const validationRoutes = require("./routes/validationRoutes");
// const tokenServiceRoutes = require('./routes/tokenServiceRoutes');

const app = express();

// app.use(express.static(path.join(__dirname, "public")));
// youa can have all of this into config/corsOptions.js
// const whiteList = ['http://localhost:5173', 'http://localhost:5000', 'http://www.google.com'];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if(whiteList.indexOf(origin) !== -1 || !origin){
//             callback(null, true); 
//         }
//         else{
//             callback(new Error('Not allowed by cors'));
//         }
//     },
//     optionsSuccessStatus: 200
// }
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
// until here
// app.use(cors(corsOptions));
app.use(cors());
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