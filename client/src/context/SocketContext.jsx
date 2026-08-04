import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Outlet, useLocation } from "react-router-dom";

const SocketContext = createContext({});

export const SocketProvider = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [offlineNotifications, setOfflineNotifications] = useState([]);
    const [peakMessages, setPeakMessages] = useState([]);
    const userid = auth?.accessToken ? jwtDecode(auth.accessToken).id : null;
    const [chatNames, setChatNames] = useState([]);
 
    useEffect(() => {
        const newSocket = io("http://localhost:5000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userid]);

    useEffect(() => {
        if (!socket || !userid) return;
        socket.on("connect", () => {
            socket.emit("addNewUser", userid);
            // console.log("connected:", socket?.id);
        });
        socket.on("getOnlineUsers", (res) => { setOnlineUsers(res); });
        return () => {
            socket.off("getOnlineUsers");
            socket.off("getNotification");
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        if (location.pathname.startsWith("/chatroom/")) return;
        socket.on("getNotification", (res) => {
            setNotifications(prev => [res, ...prev]);
            setPeakMessages(prev => prev.map(p => p.chatid == res.chatid ? { ...p, message: res.message } : p));
        });

        return () => {
            socket.off("getNotification");
        };
    }, [socket, location]);

    useEffect(() => {
        const getLatestMessages = async () => {
            try {
                if (!userid) return;
                const res = await axiosPrivate.get("/chats/messages");
                if (res.data.length > 0) setPeakMessages(res.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getLatestMessages();
    }, [socket, location]);

    useEffect(() => {
        if (!socket) return;
        socket.on("getUpdateChatName", (res) => {
            setChatNames(prev => prev.map(p => p.chatid == res.chatid ? { ...p, chat_name: res.chatName } : p));
        });

        return () => {
            socket.off("getUpdateChatName");
        };
    }, [socket, location]);

    useEffect(() => {
        const getOfflineNotifications = async () => {
            try {
                if (!userid) return;
                const res = await axiosPrivate.get("/chats/offline-notifications");
                if (res.data.length > 0) setOfflineNotifications(res.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getOfflineNotifications();
    }, []);

    useEffect(() => {
        const getChatNames = async () => {
            try {
                if (!userid) return;
                const res = await axiosPrivate.get("/chats");
                if (res.data) setChatNames(res.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getChatNames();
    }, []);

    return (
        <SocketContext.Provider value={{ onlineUsers, socket, notifications, setNotifications, peakMessages, setPeakMessages, offlineNotifications, setOfflineNotifications, chatNames, setChatNames }}>
            <Outlet />
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);