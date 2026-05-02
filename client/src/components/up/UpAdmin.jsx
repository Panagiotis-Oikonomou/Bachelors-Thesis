import paroxoi from '../assets/images/paroxoi.png';
import users from '../assets/images/users.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';
import styles from './UpAdmin.module.css';

import { Link } from "react-router-dom";

export function UpAdmin() {
    return (
        <>
            <img src={menu} className={styles.menu} alt="menu" />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>
        </>
    )
}