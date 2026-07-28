import { Link, useParams } from "react-router-dom";
import styles from '../../assets/css/links.module.css'
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import useChat from "../../hooks/useChat";
import MainLayout from "../../components/mainLayout";
import { Box, Button, Icon, IconButton, Paper, TextareaAutosize, Typography } from "@mui/material";
import { EmojiEmotionsOutlined, KeyboardBackspaceOutlined, MapOutlined, MoreHorizOutlined, NotificationsActiveOutlined, PaddingOutlined, SendOutlined } from "@mui/icons-material";
import { scrollbarStyles } from "../styles/scrollbar";
import WaitingToDelete from "../../components/WaitingToDelete";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MyComponent from "../../components/maps/MyComponent";

function ChatRoom() {
  const { chatId } = useParams();
  const { chat, userId, text, showPicker, chatRef, bottomRef, textareaRef, menuRef,
    onlineUsers, grouped, setOpenMenu, openMenu, unsendText, setText, keyPressed,
    setShowPicker, onEmojiClick, sendText, notifications, peakMessages, waitingDelete,
    changeWaitingDelete, chatName, showWaiting, setShowWaiting, openMap, setOpenMap,
    coordinates
  } = useChat(chatId);

  const mainMessageSx = { maxWidth: "50%", p: 1, mx: 1, mt: 1, mb: 2, borderRadius: 2, wordBreak: "break-word", whiteSpace: "pre-wrap", display: "flex", flexDirection: "column", position: "relative", };
  const mainDeletedSx = { bgcolor: "#e0e0e0", color: "#777", fontStyle: "italic" };

  return (
    <MainLayout mxW="xl" containerSx={{ p: { xs: 0 } }} paperSx={{ overflow: "hidden", p: { xs: 0, md: 1 }, }}>
      <Box sx={{ display: "flex", }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center", width: "30%", height: "89dvh", }}>
          <Typography variant="h6">{chatName}</Typography>

          <Paper variant="outlined" sx={{ overflowY: "auto", overflowX: "hidden", display: { xs: "none", md: "block" }, flexDirection: "column", width: "100%", height: "100%", p: 1, ...scrollbarStyles }}>
            {Object.entries(grouped).map(([chatId, members]) => {
              const onlineCount = onlineUsers.filter(online =>
                online.userId !== userId &&
                members.some(m => m.userid === online.userId)).length;
              return (
                <Link key={chatId} to={`/chatroom/${chatId}`} className={styles.linkNoColor}>
                  <Paper sx={{ mb: 2, p: 1, display: "flex", alignItems: "center", ":hover": { bgcolor: "#293440" } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography>{members[0].chat_name}</Typography>
                        {onlineCount > 0 && (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 17, height: 17, borderRadius: "50%", backgroundColor: "#16833e", flexShrink: 0 }}> {onlineCount}</Box>
                        )}
                      </Box>
                      <Box sx={{ color: "#a28e8e", }}>
                        <Typography sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: { md: 170, lg: 250 }, fontSize: { md: "0.9rem" }, }}>Latest message: {peakMessages.find(p => p.chatid == members[0].chatid)?.message}</Typography>
                      </Box>
                    </Box>
                    {notifications.some(n => n.chatid == members[0].chatid && !n.isRead) && (
                      <Box sx={{ position: "relative", marginLeft: "auto", display: "flex", alignItems: "center" }}>
                        <NotificationsActiveOutlined sx={{ width: 23, height: 23 }} />
                        <Typography component="span" sx={{
                          position: "absolute", top: -7, right: -7, width: 20, height: 20,
                          color: "white", display: "flex", borderRadius: "50%", backgroundColor: "#ef4444", alignItems: "center", justifyContent: "center"
                        }}>
                          {notifications.filter(n => n.chatid == members[0].chatid && !n.isRead).length}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Link>
              )
            })}
          </Paper>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "100%", md: "70%" }, ml: { xs: 0, md: 1 }, gap: { xs: 0, md: 1 }, height: "89dvh" }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "space-between", width: "100%", position: "relative" }}>
            <Link to="/my_chats" className={styles.linkNoColor}><KeyboardBackspaceOutlined /></Link>
            <Typography variant="h6">{chatName}</Typography>
            <Box sx={{ display: "flex" }}>
              <IconButton onClick={() => setOpenMap(m => !m)}><MapOutlined /></IconButton>
              <IconButton onClick={() => setShowWaiting((w) => !w)}><PaddingOutlined /></IconButton>
            </Box>
            {showWaiting && (
              <Box sx={{ position: "absolute", flexDirection: "column", zIndex: 1000, top: { xs: 33, sm: 25 }, right: { xs: -10, sm: -14 }, transform: { xs: "scale(0.90)", sm: " scale(0.80)" }, }}>
                <WaitingToDelete waitingDelete={waitingDelete} changeWaitingDelete={changeWaitingDelete} userId={userId} style={{ overflowY: "auto", maxHeight: 300, overflowX: "hidden" }} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, width: "100%" }}>
            <IconButton onClick={() => setOpenMap(m => !m)}><MapOutlined /></IconButton>
            <WaitingToDelete waitingDelete={waitingDelete} changeWaitingDelete={changeWaitingDelete} userId={userId} style={{ display: { xs: "none", md: "flex" }, overflowX: "auto", overflowY: "hidden", }} />
          </Box>

          {openMap === true && (
            <Box sx={{ flex: 1, height: "100%", width: { xs: "100%", md: "100%" } }}>
              <MapContainer key="map" center={[38, 23]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coordinates.lat, coordinates.lng]}></Marker>
              </MapContainer>
            </Box>
          )}

          {openMap === false && (
            <Paper variant="outlined" sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflowX: "hidden", overflowY: "auto", ...scrollbarStyles }} ref={chatRef}>
              {chat.map((item) => (
                <Box sx={item.unsent == 1 ? (userId === item.userid ? { alignSelf: "flex-end", ...mainMessageSx, ...mainDeletedSx } : { alignSelf: "flex-start", ...mainMessageSx, ...mainDeletedSx }) : (userId === item.userid ? { alignSelf: "flex-end", bgcolor: "#0084ff", ...mainMessageSx } : { alignSelf: "flex-start", bgcolor: "#acc847", color: "black", ...mainMessageSx })}
                  key={item.messageid}>

                  {(userId !== item.userid && onlineUsers.some(o => o.userId == item.userid)) && (
                    <Box sx={{ position: "absolute", top: "3px", left: "6px", width: "10px", height: "10px", borderRadius: "50%", bgcolor: "#16833e" }}></Box>
                  )}

                  {userId !== item.userid && (
                    <Box sx={{ fontSize: "medium" }}>
                      {item.username}
                    </Box>
                  )}

                  {item.unsent == 1 ? (
                    <Box sx={{ textDecoration: "line-through" }}>
                      Message deleted
                    </Box>
                  ) : (<Box>{item.message}</Box>)}

                  <Box sx={{ fontSize: "x-small" }}>
                    {moment(item.createdat).calendar()}
                  </Box>

                  {userId === item.userid && item.unsent !== 1 && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
                      <IconButton sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: "none", border: "none", cursor: "pointer", p: { xs: 0 }, }}
                        onClick={() => setOpenMenu(openMenu === item.messageid ? null : item.messageid)}>
                        <MoreHorizOutlined />
                      </IconButton>

                      {openMenu === item.messageid && (
                        <Box ref={menuRef} sx={{ position: "absolute", right: 0, top: "100%", mt: 0.5, borderRadius: 1, bgcolor: "white", boxShadow: 3, zIndex: 1000, ":hover": { bgcolor: "#0d6efd" } }}>
                          <Button onClick={() => unsendText(item)}>
                            Unsend
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
              <Box ref={bottomRef}></Box>
            </Paper>
          )}

          {openMap === false && (
            <Box sx={{ position: "relative", display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <TextareaAutosize style={{ width: "100%" }} minRows={3} maxRows={3} placeholder="Message..." ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={keyPressed} />
              <IconButton onClick={() => setShowPicker((p) => !p)}><EmojiEmotionsOutlined /></IconButton>

              {showPicker && (
                <Box sx={{ position: "absolute", bottom: { xs: 0, sm: 30, md: "100%" }, left: 0, right: { xs: "90%", md: "80%" }, transform: { xs: "scale(0.70)", sm: "scale(0.80)", md: "scale(0.90)" } }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </Box>
              )}
              <IconButton sx={{ borderRadius: "50%", border: "none", background: "#0d6efd", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "background 0.2s ease" }} onClick={() => sendText()}><SendOutlined /></IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </MainLayout>
  )
}
export default ChatRoom;