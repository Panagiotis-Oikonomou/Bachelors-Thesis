import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './ChatRoom.module.css'
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';

function ChatRoom() {
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

            <div className={styles.chatName}><p>To id</p></div>
            <div className={styles.otherChats}>
                <div className={styles.insideOtherChats}>
                    <Link to='/chatroom' className={styles.alink}>
                        {/* className="chat-data" */}
                        <div >
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div><br /><br />

                <div className={styles.insideOtherChats}>
                    <Link to='/chatroom' className={styles.alink}>
                        <div>
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>
            </div>

            <div className={styles.chat}>
                George<br />
                <div className={styles.otherMessage}>Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className="othermessage">Something that they say</div><br /><br />
                <div className={styles.myMessage}>Something that i say</div><br />
            </div>
            <div className={styles.type}>
                <form>
                    <textarea></textarea>
                </form>
            </div>
        </div>
    )
}
export default ChatRoom;