import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './ChatRoom.module.css'
import { Up } from "../../components/up/Up";

function ChatRoom() {
    return (
        <div className={styles.container}>
            <Up></Up>

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