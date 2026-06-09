import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Notifications.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notificationsVisit.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';


function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axiosPrivate.get('/notifications');
                if (res.data) setNotifications(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getNotifications();
    }, []);

    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.notifications}>
                {notifications.map((item) => {
                    return <div className={styles.not} onClick={() => console.log(item.message)} key={item.notid}>
                        {item.message + " " + item.is_read}
                    </div>
                })}
            </div>
        </div>
    )
}

export default Notifications;