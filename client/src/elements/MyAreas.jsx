import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './MyAreas.module.css'
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';
import plus from '../assets/images/plus.png';

function MyAreas() {
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

            <div className={styles.searchBar}>
                {/* <form> */}
                    <input type="search" placeholder="search"/>
                    <button>Go</button>
                 {/* </form> */}
            </div>

            <div className={styles.areas}>
                <p>Δημιουργία νέας έκτασης <Link to='/add_area'><img src={plus} className={styles.plus}/></Link></p>
                <div className={styles.area}>
                    {/* href="managearea.html" */}
                    <Link to='/profile'  className={styles.alink}><div className={styles.areaData}>
                    Όνομα περιοχής: Κάτι<br/><br/>

                    Έκταση περιοχής: Κάτι άλλο<br/><br/></div></Link>
                </div><br/><br/>
            </div>
        </div>
    )
}
export default MyAreas;