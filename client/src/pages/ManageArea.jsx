import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './ManageArea.module.css';
import { Up } from "../components/up/Up";

// import matchings from '../assets/images/mymatchings.png';
// import myareas from '../assets/images/myareas.png';
// import criteria from '../assets/images/criteria.png';
// import match from '../assets/images/match.png';
// import chats from '../assets/images/chats.png';
// import notifications from '../assets/images/notifications.png';
// import profile from '../assets/images/profile.png';
// import menu from '../assets/images/menu.png';


function ManageArea() {
    return (
        <div className={styles.container}>
            <Up></Up>
            {/* <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div> */}

            <div class={styles.addArea}>
                <div className={styles.deleteContainer}>
                    <button class={styles.delete}>Διαγραδή έκτασης</button>
                </div>
                <form>
                    Όνομα περιοχής:<br /><input type="text" id="area-name" value="kati" />
                    <div id="error_msg1"></div><br />

                    Έκταση περιοχής (σε km<sup>2</sup>):<br /><input type="number" id="size" max="131" value="23" />

                    <div id="error_msg2"></div><br />

                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form><br />

            </div>
        </div>
    )
}

export default ManageArea;