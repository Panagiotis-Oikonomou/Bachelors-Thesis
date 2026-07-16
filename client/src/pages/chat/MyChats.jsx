import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useSocket } from "../../context/SocketContext";
import { Up } from "../../components/up/Up";
import styles from './MyChats.module.css';
import { BsBell } from 'react-icons/bs';
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

function MyChats() {
    const { auth } = useAuth();
    const { onlineUsers, notifications, peakMessages } = useSocket();
    const axiosPrivate = useAxiosPrivate();
    const [chats, setChats] = useState([]);
    const [userId, setUserId] = useState("");
    const grouped = chats.reduce((acc, item) => {
        if (!acc[item.chatid]) acc[item.chatid] = [];

        acc[item.chatid].push(item);
        return acc;
    }, {});

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
        setUserId(jwtDecode(auth?.accessToken).id);
    }, []);
    return (
        <div className={styles.container}>
            <Up />

            <div className={styles.chats}>
                {Object.entries(grouped).map(([chatId, members]) => {
                    const onlineCount = onlineUsers.filter(
                        online =>
                            online.userId !== userId &&
                            members.some(m => m.userid === online.userId)
                    ).length;

                    return (
                        <Link key={chatId} to={`/chatroom/${chatId}`} className={styles.alink}>
                            <div className={styles.chat}>
                                <div className={styles.chatInfo}>
                                    <div className={styles.chatNames}>
                                        {members[0].chat_name}

                                        {onlineCount > 0 && (
                                            <div className={styles.activeUsers}>
                                                {onlineCount}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.lastMessage}>
                                        Latest message: {peakMessages.find(p => p.chatid == members[0].chatid)?.message}
                                    </div>
                                </div>
                                {notifications.some(n => n.chatid == members[0].chatid && !n.isRead) && (
                                    <div className={styles.notificationIcon}>
                                        <BsBell size={3} />
                                        <span className={styles.notificationBadge}>
                                            {notifications.filter(n => n.chatid == members[0].chatid && !n.isRead).length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default MyChats;