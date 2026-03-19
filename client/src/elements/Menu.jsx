// components/Menu.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Menu.module.css"; // optional

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profileVisit.png';
import menu from '../assets/images/menu.png';

export default function Menu() {
    const [open, setOpen] = useState(false);

    return (
        <div className={open ? "main-hidden" : ""}>
            {/* menu button */}
            <img
                src={menu}
                className={styles.menu}
                alt="menu"
                onClick={() => setOpen(!open)}
            />

            {/* menu content */}
            {open && (
                <div className={styles.up}>
                    <Link to='/matchings'><img src={matchings} /></Link>
                    <Link to='/my_areas'><img src={myareas} /></Link>
                    <Link to='/criteria'><img src={criteria} /></Link>
                    <Link to='/match'><img src={match} /></Link>
                    <Link to='/my_chats'><img src={chats} /></Link>
                    <Link to='/notifications'><img src={notifications} /></Link>
                    <Link to='/profile'><img src={profile} /></Link>
                </div>
            )}
        </div>
    );
}