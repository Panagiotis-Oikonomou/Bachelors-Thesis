
import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './Profile.module.css';
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';

function Profile() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <a href="checkmatchings.html"><img src={matchings} /></a>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <a href="criteria.html"><img src={criteria} /></a>
                <a href="match.html"><img src={match} /></a>
                <Link to='/my_chats'><img src={chats} /></Link>
                <a href="notifications.html"><img src={notifications} /></a>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.profile}>
                <div className={styles.logoutContainer}>
                    <button className={styles.logout} id="logout">Logout</button>
                </div>
                <form autoComplete="off">
                    Όνομα:<br /><input type="text" id="fname" />
                    <div id="error_msg1"> </div><br />

                    Επώνυμο:<br /><input type="text" id="lname" />
                    <div id="error_msg2"> </div><br />

                    Αριθμός ρολογιού:<br /><input type="text" id="clock" />
                    <div id="error_msg3"> </div><br />

                    Πάροχος ενέργειας:<br />
                    <select id="id_power" required>
                        <option value="some">SOMDSO</option>
                        <option value="zeniu">ZENIU</option>
                        <option value="protergia">PROTERGIA</option>
                        <option value="other">PROTERGIA</option>
                    </select><br /><br />

                    Email:<br /><input type="email" id="mail" pattern="'/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'" /><br /><br />

                    Username:<br /><input type="text" id="usr" />
                    <div id="error_msg4"> </div><br />

                    Password:<br /><input type="password" id="psw" /><br />
                    <input type="checkbox" id="pswshow" /> Εμφάνιση κωδικού<br />
                    <div id="error_msg5"> </div><br />

                    Confirm Password:<br /><input type="password" id="cpsw" /><br />
                    <input type="checkbox" id="cpswshow" /> Εμφάνιση κωδικού<br />
                    <div id="error_msg6"> </div>
                    <div id="pswmatch"> </div><br />

                    <div id="not_send"> </div>
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form><br />
            </div>
        </div>
    )
}
export default Profile;