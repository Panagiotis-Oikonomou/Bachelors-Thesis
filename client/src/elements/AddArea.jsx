import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './AddArea.module.css';

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';
import map from '../assets/images/map.png';


function AddArea() {
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

            <div className={styles.addArea}>
                <p className={styles.titlee}>Δημιουργία καινούργιας περιοχής</p><br />
                <form autoComplete="off">
                    Όνομα περιοχής:<br /><input type="text" id="area-name" required />
                    <div id="error_msg1"></div><br />

                    Μέγεθος έκτασης (σε km<sup>2</sup>):<br /><input type="number" id="size" max="131" required /><br /><br />

                    Ποσοστό ηληοφάνειας:<br /><input type="text" id="sun" readOnly required /><br /><br />

                    Cordinates:<br /><input type="text" id="cordinates" readOnly required /><br /><br />
                    <div>Map&nbsp;&nbsp;&nbsp;<img src={map} className={styles.mapButton} /></div><br />

                    <div id="error_msg2"></div><br />

                    <input type="submit" value="Δημιουργία" />
                </form>
            </div>
            <div id="map" className={styles.map}></div>
        </div>
    )
}

export default AddArea;