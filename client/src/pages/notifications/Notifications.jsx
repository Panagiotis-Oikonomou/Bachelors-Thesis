import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Notifications.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notification from '../../assets/images/notificationsVisit.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';


function Notifications() {
    const axiosPrivate = useAxiosPrivate();
    const [notifications, setNotifications] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axiosPrivate.get('/notifications');
                if (res.data) setNotifications(res.data.map(n => ({...n, expanded:false})));
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
                    ? { ...notification, is_read: true, expanded: notification.type === "conf" ? !notification.expanded : false }
                    : notification
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
        }
        catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
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
                    if (item.type === "info") {
                        return (<div
                            className={item.is_read ? styles.read : styles.not}
                            onClick={() => changeToRead(item.notid)}
                            key={item.notid}>

                            <div className={styles.delete} onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }}> X </div>
                            asd{item.message}
                        </div>)
                    }
                    else if (item.type === "conf") {
                        return (<div
                            className={`${item.is_read ? styles.read : styles.not} ${item.expanded ? styles.open : ""}`}
                            onClick={() => changeToRead(item.notid)}
                            key={item.notid}>

                            <div className={styles.delete} onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }}> X </div>
                            {item.message}
                            <button className={styles.accept}>Accept</button> <button className={styles.decline}>Decline</button>
                        </div>)
                    }
                })}
            </div>
        </div>
    )
}

export default Notifications;