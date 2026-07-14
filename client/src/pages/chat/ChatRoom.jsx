import { Link, useParams } from "react-router-dom";
import styles from './ChatRoom.module.css'
import { Up } from "../../components/up/Up";
import moment from 'moment';
import { BsEmojiSmile, BsSendFill, BsThreeDots, BsBell, BsCheck2Circle, BsXCircle, BsCheckCircle } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import useChat from "../../hooks/useChat";

function ChatRoom() {
    const { chatId } = useParams();
    const { chat, userId, text, showPicker, chatRef, bottomRef, textareaRef, menuRef,
        onlineUsers, grouped, setOpenMenu, openMenu, unsendText, setText, keyPressed,
        setShowPicker, onEmojiClick, sendText, notifications, peakMessages, waitingDelete,
        changeWaitingDelete
    } = useChat(chatId);

    return (
        <div className={styles.container}>
            <Up />

            <div className={styles.delete}>{waitingDelete.map((item) => (
                <div key={item.delid} className={styles.deleteData}>{item.username}
                    {item.userid == userId && (
                        <span>
                            <BsCheckCircle className={item.destroy ? styles.yes : styles.yesPointer} onClick={() => changeWaitingDelete(1)}/>
                            <BsXCircle className={item.destroy ? styles.noPointer :styles.no} onClick={() => changeWaitingDelete(0)}/>
                        </span>
                    )}
                    {item.userid != userId && (
                        <span>{item.destroy == 0 ? (<BsXCircle className={styles.no} />) : (<BsCheckCircle className={styles.yes} />)}</span>
                    )}
                </div>
            ))}</div>

            <div className={styles.chatName}><p>To id</p></div>
            <div className={styles.otherChats}>
                {Object.entries(grouped).map(([chatid, members]) => (
                    <Link to={`/chatroom/${chatid}`} className={styles.alink} key={chatid}>
                        <div className={styles.insideOtherChats} >
                            {notifications.some(n => n.chatid == chatid && n.isRead == false) && (
                                <div className={styles.notificationIcon}>
                                    <BsBell size={3} />
                                    <span className={styles.notificationBadge}>{notifications.filter(n => n.chatid == chatid && n.isRead == false).length}</span>
                                </div>
                            )}
                            <div className={styles.memb}>
                                {members.map(member => (
                                    <div key={member.username}>
                                        <span className={onlineUsers.some((u) => u?.userId === member.userid) ? styles.online : ""}>{member.username}</span>
                                    </div>
                                ))}
                            </div>

                            {chatid != chatId && (
                                <div className={styles.lastMessage}>
                                    Latest message: {peakMessages.find(p => p.chatid == chatid)?.message}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.chat} ref={chatRef}>
                {chat.map((item) => (
                    <div className={item.unsent == 1 ? `${styles.deletedMessageBubble} ${userId === item.userid
                        ? styles.myDeletedMessage
                        : styles.otherDeletedMessage}`
                        : userId === item.userid
                            ? styles.myMessage
                            : styles.otherMessage
                    } key={item.messageid}
                    >
                        {userId !== item.userid && item.unsent != 1 && (
                            <div className={styles.userName}>
                                {item.username}
                                <br />
                            </div>
                        )}

                        {item.unsent == 1 ? (
                            <div className={styles.deletedMessage}>
                                Message deleted
                            </div>
                        ) : (<div>{item.message}</div>)}

                        <div className={styles.date}>
                            {moment(item.createdat).calendar()}
                        </div>

                        {userId === item.userid && item.unsent !== 1 && (
                            <div className={styles.messageOptions}>
                                <button className={styles.optionsButton}
                                    onClick={() => setOpenMenu(openMenu === item.messageid ? null : item.messageid)}
                                >
                                    <BsThreeDots />
                                </button>

                                {openMenu === item.messageid && (
                                    <div ref={menuRef} className={styles.chatMenu}>
                                        <button onClick={() => unsendText(item)}>
                                            Unsend
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className={styles.type}>
                <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={keyPressed} />

                <button onClick={() => setShowPicker((p) => !p)}>
                    <BsEmojiSmile />
                </button>

                {showPicker && (
                    <div className={styles.picker}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <button className={styles.sendButton} onClick={() => sendText()}><BsSendFill size={18} /></button>
            </div>
        </div>
    )
}
export default ChatRoom;