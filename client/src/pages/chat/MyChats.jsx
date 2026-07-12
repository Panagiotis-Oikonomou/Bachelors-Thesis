import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useSocket } from "../../context/SocketContext";
import { Up } from "../../components/up/Up";
import styles from './MyChats.module.css';

function MyChats() {
    const { onlineUsers } = useSocket();
    const axiosPrivate = useAxiosPrivate();
    const [chats, setChats] = useState([]);
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
    }, []);
    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.chats}>
                {Object.entries(grouped).map(([chatid, members]) => (
                    <Link to={`/chatroom/${chatid}`} className={styles.alink} key={chatid}>
                        <div className={styles.chat} >
                            {members.map(member => (
                                <div className={styles.chatData} key={member.username}>
                                    <span className={onlineUsers.some((u) => u?.userId === member.userid) ? styles.online : ""}>{member.username}</span>
                                </div>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MyChats;