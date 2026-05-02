import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from './ChatRoom.module.css'
import { Up } from "../components/up/Up";

function ChatRoom() {
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