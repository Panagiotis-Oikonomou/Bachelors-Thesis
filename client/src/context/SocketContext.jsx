import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

const SocketContext = createContext({});

export const SocketProvider = () => {
    const { auth } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const userid = auth?.accessToken ? jwtDecode(auth.accessToken).id : null;

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
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
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ onlineUsers, socket }}>
            <Outlet />
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);