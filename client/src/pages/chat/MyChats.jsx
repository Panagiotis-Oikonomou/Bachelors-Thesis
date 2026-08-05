import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useSocket } from "../../context/SocketContext";
import styles from '../../assets/css/links.module.css';
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import MainLayout from "../../components/mainLayout";
import { Box, Paper, Typography } from "@mui/material";
import { NotificationsActiveOutlined } from "@mui/icons-material";

function MyChats() {
  const { auth } = useAuth();
  const { onlineUsers, notifications, peakMessages, offlineNotifications, chatNames } = useSocket();
  const axiosPrivate = useAxiosPrivate();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState("");
  const grouped = chatNames.reduce((acc, item) => {
    if (!acc[item.chatid]) acc[item.chatid] = [];

    acc[item.chatid].push(item);
    return acc;
  }, {});

  useEffect(() => {
    setUserId(jwtDecode(auth?.accessToken).id);
    document.title = "MyChats";
  }, []);

  return (
    <MainLayout mxW="sm" paperSx={{ p: { xs: 0, sm: 2 } }}>
      {chatNames.length === 0 && <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Δεν έχεις κάποιο chat.</Typography>}
      {Object.entries(grouped).map(([chatId, members]) => {
        const onlineCount = onlineUsers.filter(online =>
          online.userId !== userId &&
          members.some(m => m.userid === online.userId)).length;
        return (
          <Link key={chatId} to={`/chatroom/${chatId}`} className={styles.linkNoColor}>
            <Paper sx={{ mb: { xs: 1, sm: 2 }, p: { xs: 1, sm: 3 }, display: "flex", alignItems: "center", ":hover": { bgcolor: "#293440" } }} variant="outlined">
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography>{members[0].chat_name}</Typography>
                  {onlineCount > 0 && (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 17, height: 17, borderRadius: "50%", backgroundColor: "#16833e", flexShrink: 0 }}> {onlineCount}</Box>
                  )}
                </Box>
                <Box sx={{ color: "#a28e8e", }}>
                  <Typography sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: { xs: 170, sm: 400 }, fontSize: { xs: "0.4rem", sm: "0.9rem" }, }}>Latest message: {peakMessages.find(p => p.chatid == members[0].chatid)?.message}</Typography>
                </Box>
              </Box>
              {(notifications.some(n => n.chatid == members[0].chatid && !n.isRead) || offlineNotifications.some(n => n.chatid == members[0].chatid && n.countOffline > 0)) && (
                <Box sx={{ position: "relative", marginLeft: "auto", display: "flex", alignItems: "center" }}>
                  <NotificationsActiveOutlined sx={{ width: 23, height: 23 }} />
                  <Typography component="span" sx={{
                    position: "absolute", top: { xs: -4, sm: -7 }, right: { xs: -4, sm: -7 }, width: { xs: 0.7, sm: 20 }, height: { xs: 0.7, sm: 20 },
                    color: "white", display: "flex", borderRadius: "50%", backgroundColor: "#ef4444", alignItems: "center", justifyContent: "center"
                  }}>
                    {notifications.filter(n => n.chatid == members[0].chatid && !n.isRead).length
                      + offlineNotifications.find(n => n.chatid == members[0].chatid).countOffline
                    }
                  </Typography>
                </Box>
              )}
            </Paper>
          </Link>
        )
      })}
    </MainLayout>
  )
}

export default MyChats;