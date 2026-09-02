import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useNotifications } from "../context/NotificationsContext";
import { useSocket } from "../context/SocketContext";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function useNotification() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setGlobalNotifications } = useNotifications();
    const [notifications, setNotifications] = useState([]);
    const { socket, onlineUsers } = useSocket();
    const [userId, setUserId] = useState(null);
    const [hasField, setHasField] = useState(null);


    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axiosPrivate.get('/notifications');
                if (res.data) setNotifications(res.data.map(n => ({ ...n, expanded: false })));
            }
            catch (err) {
                console.log(err);
            }
        }
        const decoded = jwtDecode(auth?.accessToken);
        setUserId(decoded.id);
        getNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("getInvitationMessage", (newNotifications) => {
            setNotifications(prev => [...newNotifications, ...prev]);
            setGlobalNotifications(prev => prev + 1);
        });

        socket.on("getMatchDeleteMessage", (res) => {
            setNotifications(prev => [...res.notifications, ...prev.map(p => p.groupid == res.groupid && p.type === "conf" ? { ...p, disabled: 1 } : p)]);
            setGlobalNotifications(prev => prev + 1);
        });

        socket.on("getChatCreation", (notification) => {
            setNotifications(prev => [...notification, ...prev]);
            setGlobalNotifications(prev => prev + 1);
        });

        socket.on("getChatDeletedInfo", (notification) => {
            setNotifications(prev => [...notification, ...prev]);
            setGlobalNotifications(prev => prev + 1);
        });

        socket.on("getAlgoInfo", (nots) => {
            setNotifications(prev => [...nots, ...prev]);
            setGlobalNotifications(prev => prev + nots.length);
        });

        socket.on("getNotMatchMessage", (nots) => {
            setNotifications(prev => [...nots, ...prev]);
            setGlobalNotifications(prev => prev + nots.length);
        });

        socket.on("getUpdateDisabled", (dis) => {
            setNotifications(prev => prev.map(p => dis.includes(p.groupid) ? {...p, disabled: 1} : p));
        });

        return () => {
            socket.off("getInvitationMessage");
            socket.off("getMatchDeleteMessage");
            socket.off("getChatCreation");
            socket.off("getChatDeletedInfo");
            socket.off("getAlgoInfo");
            socket.off("getNotMatchMessage");
            socket.off("getUpdateDisabled");
        };
    }, [socket]);

    async function changeToRead(id) {
        setGlobalNotifications(prev => prev > 0 ? prev - 1 : 0);
        setNotifications(prev =>
            prev.map(notification =>
                notification.notid === id
                    ? { ...notification, is_read: true, expanded: !notification.expanded } : notification
            )
        );
        try {
            await axiosPrivate.put(`/notifications/${id}`);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function deleteNotification(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            await axiosPrivate.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.notid !== id));
            setGlobalNotifications(prev => prev > 0 ? prev - 1 : 0);
        }
        catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    }

    function setDisabled(id) {
        setNotifications(prev =>
            prev.map(notification =>
                notification.notid === id
                    ? { ...notification, disabled: true }
                    : notification
            )
        );
    }

    async function accept(item) {
        setDisabled(item.notid);
        
        try {
            await axiosPrivate.put(`/notifications/disabled/${item.notid}`);
            const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
            const res = await axiosPrivate.put('/matchings', { notid: item.notid, agrees: 1 });
            if (!res.data) return;
            if (hasField != null && res.data.lastUser === true) {
                setNotifications(prev => prev.map(n => n.type == "conf" ? { ...n, disabled: true } : n));
                try {
                    const r = await axiosPrivate.put("/notifications/disable", {groupid: item.groupid, getRecipients});
                    if(r.data) socket.emit("updateDisabled", {groupids: r.data.groupids, userId, not: r.data.not});

                } catch (error) {
                    console.log(error);
                }
            }
            const res2 = await axiosPrivate.post("/matchings/online_users", { getRecipients, groupid: res.data.groupid, choice: 0 });
            if (res2.data) {
                socket.emit("updateMatchings", { groupid: res.data.groupid, recipients: res2.data, userId });
                if (res.data.returnNot.length > 0) socket.emit("sendChatCreation", { groupid: res.data.groupid, recipients: res2.data, userId, notifications: res.data.returnNot });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async function decline(item) {
        setDisabled(item.notid);

        try {
            await axiosPrivate.put(`/notifications/disabled/${item.notid}`);
            const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
            const res2 = await axiosPrivate.post("/matchings/online_users", { getRecipients, groupid: item.groupid, choice: 1 });
            const res = await axiosPrivate.put('/matchings', { notid: item.notid, agrees: 0 });
            if (!res.data) return;
            if (res2.data) socket.emit("declineMatch", { groupid: res.data.groupid, recipients: res2.data, not: res.data.not });
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        document.title = "Notifications";
    }, []);

    useEffect(() => {
        const hasField = async () => {
            try {
                const res = await axiosPrivate.get("criteria/field");
                if (res.data) setHasField(res.data);

            } catch (error) {
                console.log(error);
            }
        }
        hasField();
    }, []);

    return {
        notifications, changeToRead, deleteNotification, accept, decline
    };
}