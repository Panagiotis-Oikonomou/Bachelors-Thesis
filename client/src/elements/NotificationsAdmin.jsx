import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './NotificationsAdmin.module.css';

import paroxoi from '../assets/images/paroxoi.png';
import users from '../assets/images/users.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';


function Notifications() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>

            <div className={styles.notifications}>
                <div className={styles.not}>
                    Κάποιο μήνυμα Admin
                </div>

                <div className={styles.not}>
                    Κάποιο μήνυμα
                </div>

                <div className={styles.not}>
                    Κάποιο μήνυμα
                </div>
            </div>
        </div>
    )
}

export default Notifications;