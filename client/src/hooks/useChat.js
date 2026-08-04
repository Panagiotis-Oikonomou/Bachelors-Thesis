import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useSocket } from "../context/SocketContext";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function useChat(chatid) {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { onlineUsers, socket, notifications, setNotifications, peakMessages, setPeakMessages, setOfflineNotifications, offlineNotifications, chatNames, setChatNames } = useSocket();
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [text, setText] = useState("");
    const [waitingDelete, setWaitingDelete] = useState([]);
    const [chatName, setChatName] = useState({name: "", chatid});
    const [tempChatName, setTempChatName] = useState("");
    const [chatNameError, setChatNameError] = useState("");

    const [showPicker, setShowPicker] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const [openChatname, setOpenChatname] = useState(false);
    const textareaRef = useRef(null);
    const chatRef = useRef(null);
    const bottomRef = useRef(null);
    const isNearBottomRef = useRef(true);
    const firstLoad = useRef(true);
    const menuRef = useRef(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [coordinates, setCoordinates] = useState([]);

    const grouped = chatNames.reduce((acc, item) => {
        if (!acc[item.chatid]) acc[item.chatid] = [];

        acc[item.chatid].push(item);
        return acc;
    }, {});

    useEffect(() => {
        if (!chatid) return;
        const getCoordinates = async () => {
            try {
                const res = await axiosPrivate.get(`/areas/coordinates/${chatid}`);
                if (res.data) setCoordinates(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getCoordinates();
    }, []);

    useEffect(() => {
        const decoded = jwtDecode(auth?.accessToken);
        setUserId(decoded.id);
        setUserName(decoded.username);
        document.title = "Chatroom";
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!chatid) {
            navigate('/my_chats');
            return;
        }

        setNotifications(prev => prev.map(n => n.chatid == chatid ? { ...n, isRead: true } : n));
    }, [chatid]);

    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        const handleScroll = () => {
            isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        };

        el.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        if (firstLoad.current) {
            bottomRef.current?.scrollIntoView({ behavior: "auto", });
            firstLoad.current = false;
            return;
        }

        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

        const lastMessage = chat[chat.length - 1];

        const isMyMessage = lastMessage?.userid === userId;

        if (isMyMessage || distanceFromBottom < 100) bottomRef.current?.scrollIntoView({ behavior: "smooth", });
    }, [chat.length]);

    useEffect(() => {
        firstLoad.current = true;
    }, [chatid]);

    useEffect(() => {
        if (!socket) return;
        socket.on("getWaitingDelete", async (res) => {
            let shouldDelete = false;
            setWaitingDelete(prev => {
                const updated = prev.map(w => w.userid === res.userid ? { ...w, destroy: res.del } : w);

                shouldDelete = updated.every(w => w.destroy === 1);

                return updated;
            });

            if (shouldDelete) return navigate("/my_chats");
        });

        socket.on("chatDeleted", () => { navigate("/my_chats") });

        return () => {
            socket.off("getWaitingDelete");
            socket.off("chatDeleted");
        };
    }, [socket, chatid]);

    useEffect(() => {
        if (!socket) return;
        socket.on("getMessage", (res) => {
            if (chatid != res.chatid) return;
            setChat((prev) => [...prev, res]);
        });

        socket.on("getNotification", (res) => {
            const isChatOpen = chatid == res.chatid;

            if (isChatOpen) setNotifications(prev => [{ ...res, isRead: true }, ...prev]);

            else setNotifications(prev => [res, ...prev]);

            setPeakMessages(prev => prev.map(p => p.chatid == res.chatid ? { ...p, message: res.message } : p));
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, chatid]);
    
    useEffect(() => {
        if (!socket) return;
        socket.on("getUpdateChatName", (res) => {
            if (chatid != res.chatid) return;
            setChatName(p => ({...p, name: res.chatName}));
            setChatNames(prev => prev.map(p => p.chatid == chatid ? { ...p, chat_name: res.chatName } : p));
        });

        socket.on("getChangeChatNameInfo", (res) => {
            if (chatid != res.message.chatid) return;
            setChat((prev) => [...prev, res.message]);
        });

        return () => {
            socket.off("getUpdateChatName");
            socket.off("getChangeChatNameInfo");
        };
    }, [socket, chatid]);

    useEffect(() => {
        if (!socket) return;
        socket.on("removeUnsendMessage", res => {
            if (chatid != res.chatid) return;
            setChat(prev => {
                const updated = prev.map(m => m.messageid === res.messageid ? { ...m, unsent: 1, message: "" } : m);

                const lastNonEmpty = [...updated].reverse().find(m => m.message.trim() !== "");

                setPeakMessages(prev => prev.map(p => p.chatid == res.chatid ? { ...p, message: lastNonEmpty ? lastNonEmpty.message : "" } : p));
            });
        });

        return () => {
            socket.off("removeUnsendMessage");
        };
    }, [socket, chatid]);

    useEffect(() => {
        const getChat = async () => {
            const res = await axiosPrivate.get(`chats/chat/${chatid}`);

            if (res.data) {
                setChat(res.data.rows);
                setChatName(p => ({...p, name:res.data.chat_name}));
                setTempChatName(res.data.chat_name);
            }
        }
        getChat();
    }, [chatid]);

    useEffect(() => {
        const getDeleteChat = async () => {
            try {
                const res = await axiosPrivate.get(`/chats/waiting_delete/${chatid}`);
                if (res.data) setWaitingDelete(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getDeleteChat();
    }, [chatid]);

    useEffect(() => {
        if (!userId) return;
        const zeroUnreadMessages = async () => {
            setOfflineNotifications(prev => prev.map(u => u.userid === userId && u.chatid == chatid ? { ...u, countOffline: 0 } : u));
            try {
                await axiosPrivate.put(`/chats/zero/${chatid}`);
            }
            catch (err) {
                console.log(err);
            }
        }
        zeroUnreadMessages();
    }, [chatid, userId]);

    async function sendText() {
        if (!text.trim()) return;
        try {
            const res = await axiosPrivate.post('/chats', { chatid, userid: userId, message: text });
            axiosPrivate.post("/chats/notifications", { onlineUsers, chatid }).catch(console.error);
            setChat((prev) => [...prev, res.data]);
            setPeakMessages(prev => prev.map(p => p.chatid == chatid ? {...p, message: text} : p));
            if (res.data) {
                if (!socket) return;
                const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
                const res2 = await axiosPrivate.post("/chats/online_users", { getRecipients, chatid });
                if (res2.data.length > 0) socket.emit("sendMessage", { message: res.data, recipients: res2.data });
            }
            setText("");
        } catch (error) {
            console.log(error);
        }
    }

    async function unsendText(message) {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Unsend",
            didClose: () => { document.activeElement?.blur(); }
        });

        if (!result.isConfirmed) return;

        try {
            await axiosPrivate.put(`/chats/${message.messageid}`);
            setChat(prev => prev.map(m => m.messageid === message.messageid ? { ...m, unsent: 1, message: "" } : m));
            if (!socket) return;
            const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
            const res = await axiosPrivate.post("/chats/online_users", { getRecipients, chatid });
            if (res.data.length > 0) socket.emit("unsendMessage", { message, recipients: res.data });
        }
        catch (err) {
            console.log(err);
        }
    }

    function keyPressed(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    }

    const onEmojiClick = (emojiData) => {
        setText((prev) => prev + emojiData.emoji);
        textareaRef.current?.focus();
    };

    async function changeWaitingDelete(del) {
        try {
            await axiosPrivate.put(`/chats/waiting_delete/${del}/${chatid}`);

            const updated = waitingDelete.map(w => w.userid === userId ? { ...w, destroy: del } : w);
            setWaitingDelete(updated);

            const getRecipients = onlineUsers?.filter(u => u.userId !== userId);
            const res = await axiosPrivate.post("/chats/online_users", { getRecipients, chatid });
            socket.emit("setChatDeleteStatus", { userId, del, recipients: res.data });

            const allAgree = updated.every(w => w.destroy == 1);

            if (allAgree) {
                await axiosPrivate.delete(`/chats/${chatid}`);
                socket.emit("chatDeleted", { recipients: res.data });
                return navigate("/my_chats");
            }
        } catch (error) {
            console.log(error);
        }
    }

    function checkChatName(chat) {
        setTempChatName(chat.trim());
        let error = "";
        let len = chat.trim().length;
        if (len === 0) error = "Το όνομα πρέπει να αποτελείται από τουλάχιστον έναν χαρακτήρα.";
        else if (len > 10) error = "Το όνομα πρέπει να αποτελείται από λιγότερο από 10 χαρακτήρες.";

        setChatNameError(error);
    }

    async function updateChatName(e) {
        e.preventDefault();

        if (chatNameError !== "") return;

        setChatName(p => ({...p, name: tempChatName}));
        setChatNames(prev => prev.map(p => p.chatid == chatid ? { ...p, chat_name: tempChatName } : p));
        setOpenChatname(false);

        try {
            await axiosPrivate.put(`/chats/chatname/${chatid}`, { chatName: tempChatName });
            const message = `Ο χρήστης ${userName} άλλαξε το όνομα του chat σε ${tempChatName}`;
            const resId = await axiosPrivate.post('/chats', { chatid, userId, message, info: true });
            setChat((prev) => [...prev, resId.data]);
            if (!socket) return;
            const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
            const res = await axiosPrivate.post("/chats/online_users", { getRecipients, chatid });
            if (res.data) socket.emit("updateChatName", { chatName: tempChatName, recipients: res.data, message: resId.data });
        } catch (error) {
            console.log(error);
        }
    }

    return {
        chat, userId, text, showPicker, chatRef, bottomRef, textareaRef, menuRef,
        onlineUsers, setOpenMenu, openMenu, grouped, unsendText, setText, keyPressed,
        setShowPicker, onEmojiClick, sendText, notifications, peakMessages, waitingDelete,
        changeWaitingDelete, chatName, showWaiting, setShowWaiting, openMap, setOpenMap,
        coordinates, offlineNotifications, openChatname, setOpenChatname, tempChatName,
        updateChatName, checkChatName, chatNameError
    };
}