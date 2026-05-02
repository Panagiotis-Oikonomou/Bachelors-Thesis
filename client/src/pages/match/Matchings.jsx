import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './Matchings.module.css';

import matchings from '../../assets/images/mymatchingsVisit.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import check from '../../assets/images/CheckmarkNew.png';


function Matchings() {
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

            <div className={styles.matchings}>
                <div className={styles.match}>
                    
                    <div className={styles.check}>
                        7 / 7<br/>
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;

                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;

                        <div className={styles.nameCheck}>user<img src={check} className={styles.v}/></div>
                    </div>
                </div>

                <div className={styles.match}>
                    
                    <div className={styles.check}>
                        7 / 7<br/>
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;

                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;
                        <div className={styles.nameCheck}>usesssssssssssssssssr<img src={check} className={styles.v}/></div>&nbsp;&nbsp;&nbsp;

                        <div className={styles.nameCheck}>user<img src={check} className={styles.v}/></div>
                    </div>
                </div><br/><br/>

            </div>
        </div>
    )
}

export default Matchings;