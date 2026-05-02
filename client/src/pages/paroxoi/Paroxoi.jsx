import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from './Paroxoi.module.css';

import paroxoi from '../../assets/images/paroxoiVisit.png';
import users from '../../assets/images/users.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import plus from '../../assets/images/plus.png';


function Paroxoi() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>

            <div className={styles.searchBar}>
                <input type="search" placeholder="search" />
                <button>Go</button>
            </div>

            <div className={styles.main}>
                <p>Προσθήκη νέου Πάροχου Ενέργειας <Link to='/add_paroxo'><img src={plus} className={styles.plus} /></Link></p>
                <div className={styles.area}>
                    <Link to='/manage_paroxo' className={styles.alink}><div className={styles.paroxos}>
                        Όνομα Πάροχου Ενέργειας: Κάτι
                    </div></Link>
                    <button className={styles.delete}>Διαγραδή παρόχου</button>
                </div>

                <div className={styles.area}>
                    <Link to='/manage_paroxo' className={styles.alink}><div className={styles.paroxos}>
                        Όνομα Πάροχου Ενέργειας: Κάτι</div></Link>
                    <button className={styles.delete}>Διαγραδή παρόχου</button>
                </div>
            </div>
        </div>
    )
}

export default Paroxoi;