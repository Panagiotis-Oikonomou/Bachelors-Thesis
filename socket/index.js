const { Server } = require("socket.io");

function initSocket(server) {
    console.log("Socket init loaded");
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    let onlineUsers = [];

    io.on("connection", (socket) => {
        console.log("new connection:", socket.id);
        socket.emit("getOnlineUsers", onlineUsers);

        socket.on("addNewUser", (userId) => {
            if(!onlineUsers.some(user => user.userId === userId)) onlineUsers.push({ userId, socketId: socket.id });
            console.log("onlineUsers", onlineUsers);
            io.emit("getOnlineUsers", onlineUsers);
        });


        socket.on("disconnect", () => {
            console.log("disconnected:", socket.id);

            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

            io.emit("getOnlineUsers", onlineUsers);

            console.log("onlineUsers after disconnect", onlineUsers);
        });
    });

    return io;
}

module.exports = initSocket;