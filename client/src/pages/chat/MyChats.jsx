import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import './MyChats.module.css';
import styles from './MyChats.module.css';
import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chatsVisit.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';

function MyChats() {
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
            <div className={styles.chats}>
                <div className={styles.chat}>
                    <Link to='/chatroom' className={styles.alink}>
                        <div className={styles.chatData}>
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>

                <div className={styles.chat}>
                    <Link to='/chatroom' className={styles.alink}>
                        <div className={styles.chatData}>
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>

                <div className={styles.chat}>
                    <Link to='/chatroom' className={styles.alink}>
                        <div className={styles.chatData}>
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>                
            </div>
        </div>
    )
}

export default MyChats;