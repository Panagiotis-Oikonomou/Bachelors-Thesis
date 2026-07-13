import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";

const SocketContext = createContext({});

export const SocketProvider = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const userid = auth?.accessToken ? jwtDecode(auth.accessToken).id : null;

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
            console.log("connected:", socket?.id);
        });
        socket.on("getOnlineUsers", (res) => { setOnlineUsers(res); });
        return () => {
            socket.off("getOnlineUsers");
            socket.off("getNotification");
        };
    }, [socket]);
    
    useEffect(() => {
        if(!socket) return;
        if(location.pathname.startsWith("/chatroom/")) return;
        socket.on("getNotification", (res) => { setNotifications(prev => [res, ...prev]); });

        return () => {
            socket.off("getNotification");
        };
    }, [socket, location]);

    return (
        <SocketContext.Provider value={{ onlineUsers, socket, notifications, setNotifications }}>
            <Outlet />
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);