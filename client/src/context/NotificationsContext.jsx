import { createContext, useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Outlet } from "react-router-dom";

const NotificationsContext = createContext({});

export const NotificationsProvider = () => {
    const axiosPrivate = useAxiosPrivate();
    const [globalNotifications, setGlobalNotifications] = useState(0);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axiosPrivate.get("/notifications/all-page");
                if (res.data) setGlobalNotifications(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getNotifications();
    }, []);

    return (
        <NotificationsContext.Provider value={{ globalNotifications, setGlobalNotifications }}>
            <Outlet />
        </NotificationsContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationsContext);