import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './Match.module.css';

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/matchVisit.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';
import larrow from '../assets/images/leftArrowBlack.png';
import rarrow from '../assets/images/rightArrowBlack.png';


function Match() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.searchArea}>
                <div className={styles.search}>
                    <form>
                        Έκταση(σε km<sup>2</sup>):<br /><input type="number" value="0" id="area1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="5.4" id="area2" max="5.4" /><br />
                        Δεν θέλω <input type="checkbox" id="charea" /><br /><br />

                        Ποσοστό ηλίου:<br /><input type="number" value="0" id="sun1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="100" id="sun2" max="100" /><br />
                        Δεν θέλω <input type="checkbox" id="chsun" readOnly /><br /><br />

                        Ποσοστό που θα έχεις:<br /><input type="number" value="0" id="per1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="100" id="per2" max="100" /><br />
                        Δεν θέλω <input type="checkbox" id="chper" readOnly /><br /><br />

                        <div id="msg"> </div><br />
                        <input type="submit" value="Αναζήτηση" />
                    </form>
                </div>
            </div>
            <div className={styles.lArrow}>Πάτα για απόρριψη<img src={larrow} /></div>
            <div className={styles.match}>
                <div className={styles.area}>
                    Όνομα: Κάτι <br /><br />

                    Έκταση(σε km<sup>2</sup>): 23 <br /><br />

                    Ποσοστό ηλειοφάνειας: 23% <br /><br />

                    Τοποθεσία:
                </div>
            </div>
            <div className={styles.rArrow}>Πάτα για αποδοχή<img src={rarrow} /></div>
        </div>
    )
}

export default Match;