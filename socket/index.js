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
            if (!onlineUsers.some(user => user.userId === userId)) onlineUsers.push({ userId, socketId: socket.id });
            console.log("onlineUsers", onlineUsers);
            io.emit("getOnlineUsers", onlineUsers);
        });

        socket.on("sendMessage", (text) => {
            const users = onlineUsers.filter((u) => text.recipients.some(r => r.userid === u.userId));

            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("getMessage", text.message);
                    io.to(u.socketId).emit("getNotification", { chatid: text.message.chatid, isRead: false, message: text.message.message });
                }
            }
        });

        socket.on("updateChatName", (text) => {
            const users = onlineUsers.filter((u) => text.recipients.some(r => r.userid === u.userId));
            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("getUpdateChatName", { chatid: text.message.chatid, chatName: text.chatName });
                    io.to(u.socketId).emit("getChangeChatNameInfo", { message: text.message });
                }
            }
        });

        socket.on("updateMatchings", (text) => {
            const users = onlineUsers.filter((u) => text.recipients.some(r => r.userid === u.userId));
            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("getUpdateMatchings", { groupid: text.groupid, userid: text.userId });
                }
            }
        });

        socket.on("declineMatch", (match) => {
            for (const u of onlineUsers) {
                const notifications = match.not.filter(r => r.userid === u.userId);
                if (notifications.length > 0) {
                    io.to(u.socketId).emit("getMatchDeleteMessage", { notifications, groupid: match.groupid });
                    io.to(u.socketId).emit("getDeleteMatching", { groupid: match.groupid });
                }
            }
        });

        socket.on("sendChatCreation", (chat) => {
            for (const u of onlineUsers) {
                const notification = chat.notifications.filter(r => r.userid === u.userId);
                if (notification.length > 0) io.to(u.socketId).emit("getChatCreation", notification);
            }
        });

        socket.on("sendChatDeletedInfo", (chat) => {
            for (const u of onlineUsers) {
                const notification = chat.notifications.filter(r => r.userid === u.userId);
                if (notification.length > 0) io.to(u.socketId).emit("getChatDeletedInfo", notification);
            }
        });

        socket.on("sendAlgoInfo", (criteria) => {
            for (const u of onlineUsers) {
                const nots = criteria.notifications.filter(r => r.userid === u.userId);
                if (nots.length > 0) io.to(u.socketId).emit("getAlgoInfo", nots);
            }
        });

        socket.on("unsendMessage", (text) => {
            const users = onlineUsers.filter((u) => text.recipients.some(r => r.userid === u.userId));

            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("removeUnsendMessage", text.message);
                }
            }
        });

        socket.on("sendInvitationMessage", (text) => {
            for (const u of onlineUsers) {
                const notifications = text.filter(r => r.userid === u.userId);

                if (notifications.length > 0) io.to(u.socketId).emit("getInvitationMessage", notifications);
            }
        });

        socket.on("setChatDeleteStatus", (t) => {
            const users = onlineUsers.filter((u) => t.recipients.some(r => r.userid == u.userId));

            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("getWaitingDelete", { userid: t.userId, del: t.del });
                }
            }
        });

        socket.on("chatDeleted", (t) => {
            const users = onlineUsers.filter((u) => t.recipients.some(r => r.userid == u.userId));

            if (users.length > 0) {
                for (const u of users) {
                    io.to(u.socketId).emit("chatDeleted");
                }
            }
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