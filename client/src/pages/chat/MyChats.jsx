import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import styles from './MyChats.module.css';
import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chatss from '../../assets/images/chatsVisit.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';

function MyChats() {
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
                console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getChats();
    }, []);
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chatss} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.chats}>
                {Object.entries(grouped).map(([chatid, members]) => (
                    <Link to='/chatroom' className={styles.alink} key={chatid}>
                        <div className={styles.chat} >
                            {members.map(member => (
                                <div className={styles.chatData} key={member.username}>
                                    {member.username}
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