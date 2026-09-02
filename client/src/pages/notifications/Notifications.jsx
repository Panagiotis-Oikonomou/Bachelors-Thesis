import MainLayout from "../../components/mainLayout";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "../../assets/css/links.module.css";
import useNotification from "../../hooks/useNotification";

function Notifications() {

  const { notifications, changeToRead, deleteNotification, accept, decline } = useNotification();

  const style = notifications.length === 0 ? { display: "flex", justifyContent: "center", alignItems: "center" } : null;

  const commonSx = {
    width: "100%",
    p: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
  }

  const messageOpenSx = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }

  const extraMessageSx = {
    flex: 1,
    mr: 1,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }
  return (
    <MainLayout mxW="sm" paperSx={{ ...style }}>
      {notifications.length === 0 && <Typography>Δεν έχεις κάποια ειδοποίηση.</Typography>}
      {notifications.map((item) => {
        if (item.type === "info") {
          return (
            <Paper key={item.notid} sx={{ mb: 3, border: 1, borderColor: item.is_read ? 'white' : 'red' }} onClick={() => changeToRead(item.notid)}>
              <Box sx={{ ...commonSx }}>
                <Typography sx={{ whiteSpace: item.expanded ? "pre-wrap" : "normal", ...extraMessageSx, ...(!item.expanded && messageOpenSx), }}>{item.message}
                  {item.chatid != null && (
                    <Link to={`/chatroom/${item.chatid}`} className={styles.link} > Πήγαινε.</Link>
                  )}
                </Typography>

                <IconButton onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }}><CloseOutlined /></IconButton>
              </Box>
            </Paper>)
        }
        else if (item.type === "conf") {
          return (
            <Paper key={item.notid} sx={{ mb: 3, border: 1, borderColor: item.is_read ? 'white' : 'red' }} onClick={() => changeToRead(item.notid)}>
              <Box sx={{ ...commonSx }}>
                <Typography sx={{ whiteSpace: item.expanded ? "pre-wrap" : "normal", ...extraMessageSx, ...(!item.expanded && messageOpenSx), }}>{item.message}</Typography>
                <IconButton onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }} disabled={item.disabled == 0}><CloseOutlined /></IconButton>
              </Box>
              <Box sx={{ p: 2, }}>
                <Button sx={{ bgcolor: "#4be675", mr: 1, width: { xs: "30%", sm: "20%" } }} variant="contained" disabled={item.disabled == 1} onClick={() => accept(item)}>Accept</Button>
                <Button sx={{ bgcolor: "#c42828", width: { xs: "30%", sm: "20%" } }} variant="contained" disabled={item.disabled == 1} onClick={() => decline(item)}>Decline</Button>
              </Box>
            </Paper>)
        }
      })}
    </MainLayout>
  )
}

export default Notifications;