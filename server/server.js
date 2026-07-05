require("dotenv").config();
const http =  require("http");
const app = require('./app');

const initSocket = require("../socket");
const port = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});