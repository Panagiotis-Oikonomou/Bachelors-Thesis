const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const app = express();

// app.use(express.static(path.join(__dirname, "public")));
// you can have all of this into config/corsOptions.js
// const allowedOrigins = ['http://localhost:5173', 'http://localhost:5000', 'http://www.google.com'];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if(allowedOrigins.indexOf(origin) !== -1 || !origin){
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
// this is a credentials.js middleware for cors policy import allowedOrigins
// do here in app.js app.use(credentials); before cors
// const credentials = (res, res, next) => {
//     const origin = res.headers.origin;
//     if(allowedOrigins.includes(origin)) res.header('Access-Control-Allow-Credentials', true);
//     next();
// }
// app.use(cors());
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