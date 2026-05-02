
import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './ProfileAdmin.module.css';

import paroxoi from '../../assets/images/paroxoi.png';
import users from '../../assets/images/users.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profileVisit.png';
import menu from '../../assets/images/menu.png';

function ProfileAdmin() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>

            <div className={styles.profile}>
                <div className={styles.logoutContainer}>
                    <button className={styles.logout} id="logout"><Link to='/index' className={styles.alink}>Logout</Link></button>
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
export default ProfileAdmin;