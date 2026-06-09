import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Notifications.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notification from '../../assets/images/notificationsVisit.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';


function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [read, setRead] = useState([]);

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

    async function changeToRead(id) {
        setNotifications(prev =>
            prev.map(notification =>
                notification.notid === id
                    ? { ...notification, is_read: true }
                    : notification
            )
        );

        try{
            await axiosPrivate.put(`/notifications/${id}`);
        }
        catch(err){
            console.log(err);
        }
    }

    async function deleteNotification(id) {
        try{
            await axiosPrivate.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.notid !== id));
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notification} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.notifications}>
                {notifications.map((item) => {
                    return <div
                        className={item.is_read ? styles.read : styles.not}
                        onClick={() => changeToRead(item.notid)}
                        key={item.notid}>

                        <div className={styles.delete} onClick={() => deleteNotification(item.notid)}> X </div>
                        {item.message}
                    </div>
                })}
            </div>
        </div>
    )
}

export default Notifications;