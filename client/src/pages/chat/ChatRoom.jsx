import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './ChatRoom.module.css'
import { Up } from "../../components/up/Up";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import 'bootstrap';
import {BsSendFill} from 'react-icons/bs';

function ChatRoom() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { chatid } = useParams();
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState([]);
    const [userId, setUserId] = useState(null);
    const [text, setText] = useState("");

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

    useEffect(() => {
        const getChat = async () => {
            const res = await axiosPrivate.get(`chats/${chatid}`);

            if (res.data) setChat(res.data);
        }
        getChat();
        const decoded = jwtDecode(auth?.accessToken);
        setUserId(decoded.id);
    }, [chatid]);

    async function sendText(txt){
        if(!txt) return;
        try {
            const res = await axiosPrivate.post('/chats', {chatid, userid: userId, message: txt});
            setChat((prev) => [...prev, res.data]);
            setText("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.container}>
            <Up />

            <div className={styles.chatName}><p>To id</p></div>
            <div className={styles.otherChats}>
                {Object.entries(grouped).map(([chatid, members]) => (
                    <Link to={`/chatroom/${chatid}`} className={styles.alink} key={chatid}>
                        <div className={styles.insideOtherChats} >
                            {members.map(member => (
                                <div key={member.username}>
                                    {member.username}
                                </div>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.chat}>
                {chat.map((item) => (
                    <div className={userId === item.userid ? styles.myMessage : styles.otherMessage} key={item.messageid}>
                        {userId !== item.userid && <div className={styles.userName}>{item.username}<br /></div>}
                        <div>{item.message}</div><br />
                        <div className={styles.date}>{moment(item.createdat).calendar()}</div>
                    </div>
                ))}
            </div>
            <div className={styles.type}>
                <InputEmoji value={text} onChange={setText} fontFamily="nunito" background="rgba(68, 156, 14, 0.2)" />
                <button className={styles.sendButton} onClick={() => sendText(text)}><BsSendFill size={18}/></button>
            </div>
        </div>
    )
}
export default ChatRoom;