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
        if (!userid) return;
        const newSocket = io("http://localhost:5000");

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("connected:", newSocket.id);
            newSocket.emit("addNewUser", userid);
        });
        
        newSocket.on("getOnlineUsers", (res) => { setOnlineUsers(res); });

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [userid]);

    return (
        <SocketContext.Provider value={{ onlineUsers, socket}}>
            <Outlet/>
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);