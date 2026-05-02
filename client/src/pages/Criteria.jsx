import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './Criteria.module.css';

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteriaVisit.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';


function Criteria() {
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

            <div className={styles.criteria}>
                <p className={styles.titlee}>Βάλε από ένα εύρος τιμών για το τι θέλεις</p><br /><br />
                <form >
                    Έκταση(σε km<sup>2</sup>):<br /><input type="number" value="0" id="area1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="5.4" id="area2" max="5.4" /><br />
                    Δεν θέλω <input type="checkbox" id="charea" /><br /><br />

                    Τι προσφέρω:<br />
                    <div className={styles.offer}>
                        <input type="radio" name="give" id="money" /><label for="money">Χρήματα</label>
                        <input type="radio" name="give" id="area" /><label for="area">Έκταση</label>
                        <input type="radio" name="give" id="other" /><label for="other">Άλλο</label>
                    </div>

                    {/* <input type="radio" value="Εκταση" name="give" /><br />
                    <input type="radio" value="Αλλο" name="give" /><br /> */}

                    Ποσοστό ηλίου:<br /><input type="number" value="0" id="sun1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="100" id="sun2" max="100" /><br />
                    Δεν θέλω <input type="checkbox" id="chsun" /><br /><br />

                    Ποσοστό που θα έχεις:<br /><input type="number" value="0" id="per1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="100" id="per2" max="100" /><br />
                    Δεν θέλω <input type="checkbox" id="chper" /><br /><br />

                    <div id="msg"> </div><br />
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}

export default Criteria;