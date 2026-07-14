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
    const { onlineUsers, socket, notifications, setNotifications, peakMessages, setPeakMessages } = useSocket();
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState([]);
    const [userId, setUserId] = useState(null);
    const [text, setText] = useState("");
    const [waitingDelete, setWaitingDelete] = useState([]);

    const [showPicker, setShowPicker] = useState(false);
    const textareaRef = useRef(null);
    const chatRef = useRef(null);
    const bottomRef = useRef(null);
    const isNearBottomRef = useRef(true);
    const firstLoad = useRef(true);
    const menuRef = useRef(null);
    const [openMenu, setOpenMenu] = useState(null);

    const grouped = chats.reduce((acc, item) => {
        if (!acc[item.chatid]) acc[item.chatid] = [];

        acc[item.chatid].push(item);
        return acc;
    }, {});

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

        setNotifications(prev => prev.map(n => n.chatid == chatid ? {...n, isRead: true} : n));
    }, [chatid]);

    useEffect(() => {
        const el = chatRef.current;
        if (!el) return;

        const handleScroll = () => {
            isNearBottomRef.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        };

        el.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            bottomRef.current?.scrollIntoView({ behavior: "auto", });

            firstLoad.current = false;
            return;
        }

        if (isNearBottomRef.current) bottomRef.current?.scrollIntoView({ behavior: "smooth", });
    }, [chat.length]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
        firstLoad.current = true;
    }, [chatid]);

    useEffect(() => {
        const getChats = async () => {
            try {
                const res = await axiosPrivate.get('/chats');
                if (res.data) setChats(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getChats();
    }, []);

    useEffect(() => {
        const getChat = async () => {
            const res = await axiosPrivate.get(`chats/${chatid}`);

            if (res.data) setChat(res.data);
        }
        getChat();
        const decoded = jwtDecode(auth?.accessToken);
        setUserId(decoded.id);
    }, [chatid]);

    useEffect(() => {
        if (!socket) return;
        socket.on("getMessage", (res) => {
            if (chatid != res.chatid) return;
            setChat((prev) => [...prev, res]);
        });

        socket.on("getNotification", (res) => {
            const isChatOpen = chatid == res.chatid;

            if(isChatOpen) setNotifications(prev => [{...res, isRead: true}, ...prev]);

            else setNotifications(prev => [res, ...prev]);

            setPeakMessages(prev => prev.map(p => p.chatid == res.chatid ?{...p, message: res.message} : p));
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, chatid]);

    useEffect(() => {
        if (!socket) return;
        socket.on("removeUnsendMessage", res => {
            if (chatid != res.chatid) return;
            setChat(prev => {
                const updated = prev.map(m => m.messageid === res.messageid ? { ...m, unsent: 1, message: "" } : m);
                
                const lastNonEmpty = [...updated].reverse().find(m => m.message.trim() !== "");

                setPeakMessages(prev => prev.map(p => p.chatid == res.chatid ? {
                    ...p, message: lastNonEmpty ? lastNonEmpty.message : "" } : p));
            });
        });

        return () => {
            socket.off("removeUnsendMessage");
        };
    }, [socket, chatid]);

    useEffect(() => {
        const getDeleteChat = async () => {
            try {
                const res = await axiosPrivate.get(`/chats/waiting_delete/${chatid}`);
                if(res.data) setWaitingDelete(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getDeleteChat();
    }, [chatid]);

    async function sendText() {
        if (!text.trim()) return;
        try {
            const res = await axiosPrivate.post('/chats', { chatid, userid: userId, message: text });
            setChat((prev) => [...prev, res.data]);
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
            confirmButtonText: "Unsend"
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
        if(del == 1){
            const allAgree = waitingDelete.every(w => w.destroy == 1 || w.userid == userId);

            if(allAgree){
                try {
                    await axiosPrivate.delete(`/chats/${chatid}`);
                    return navigate("/my_chats");
                } catch (error) {
                    console.log(error);
                }
            }
        }

        try {
            await axiosPrivate.put(`/chats/waiting_delete/${del}/${chatid}`);
            setWaitingDelete(prev => prev.map(w => w.userid == userId ? {...w, destroy: del} : w));
        } catch (error) {
            console.log(error);
        }
    }

    return {
        chat, userId, text, showPicker, chatRef, bottomRef, textareaRef, menuRef,
        onlineUsers, setOpenMenu, openMenu, grouped, unsendText, setText, keyPressed,
        setShowPicker, onEmojiClick, sendText, notifications, peakMessages, waitingDelete,
        changeWaitingDelete
    };
}