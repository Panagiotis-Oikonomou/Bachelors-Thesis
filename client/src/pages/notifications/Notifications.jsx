import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import MainLayout from "../../components/mainLayout";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useNotifications } from "../../context/NotificationsContext";
import { useSocket } from "../../context/SocketContext";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';
import { Link } from "react-router-dom";
import styles from "../../assets/css/links.module.css";

function Notifications() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { setGlobalNotifications } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const { socket, onlineUsers } = useSocket();
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axiosPrivate.get('/notifications');
        if (res.data) setNotifications(res.data.map(n => ({ ...n, expanded: false })));
      }
      catch (err) {
        console.log(err);
      }
    }
    const decoded = jwtDecode(auth?.accessToken);
    setUserId(decoded.id);
    getNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("getInvitationMessage", (newNotifications) => {
      setNotifications(prev => [...newNotifications, ...prev]);
      setGlobalNotifications(prev => prev + 1);
    });

    socket.on("getMatchDeleteMessage", (res) => {
      setNotifications(prev => [...res.notifications, ...prev.map(p => p.groupid == res.groupid && p.type === "conf" ? {...p, disabled: 1} : p)]);
      setGlobalNotifications(prev => prev + 1);
    });

    return () => {
      socket.off("getInvitationMessage");
      socket.off("getMatchDeleteMessage");
    };
  }, [socket]);

  async function changeToRead(id) {
    setGlobalNotifications(prev => prev > 0 ? prev - 1 : 0);
    setNotifications(prev =>
      prev.map(notification =>
        notification.notid === id
          ? { ...notification, is_read: true, expanded: !notification.expanded } : notification
      )
    );
    try {
      await axiosPrivate.put(`/notifications/${id}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  async function deleteNotification(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.notid !== id));
      setGlobalNotifications(prev => prev > 0 ? prev - 1 : 0);
    }
    catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  function setDisabled(id) {
    setNotifications(prev =>
      prev.map(notification =>
        notification.notid === id
          ? { ...notification, disabled: true }
          : notification
      )
    );
  }

  async function accept(id) {
    setDisabled(id);

    try {
      await axiosPrivate.put(`/notifications/disabled/${id}`);
      const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
      const res = await axiosPrivate.put('/matchings', { notid: id, agrees: 1 });
      if (!res.data) return;
      const res2 = await axiosPrivate.post("/matchings/online_users", { getRecipients, groupid: res.data.groupid, choice: 0 });
      if (res2.data) socket.emit("updateMatchings", { groupid: res.data.groupid, recipients: res2.data, userId });
    }
    catch (err) {
      console.log(err);
    }
  }

  async function decline(item) {
    setDisabled(item.notid);

    try {
      await axiosPrivate.put(`/notifications/disabled/${item.notid}`);
      const getRecipients = onlineUsers?.filter((u) => u.userId !== userId);
      const res2 = await axiosPrivate.post("/matchings/online_users", { getRecipients, groupid: item.groupid, choice: 1 });
      const res = await axiosPrivate.put('/matchings', { notid: item.notid, agrees: 0 });
      if (!res.data) return;
      if (res2.data) socket.emit("declineMatch", { groupid: res.data.groupid, recipients: res2.data, not: res.data.not });
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    document.title = "Notifications";
  }, []);

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
                <Button sx={{ bgcolor: "#4be675", mr: 1, width: { xs: "30%", sm: "20%" } }} variant="contained" disabled={item.disabled == 1} onClick={() => accept(item.notid)}>Accept</Button>
                <Button sx={{ bgcolor: "#c42828", width: { xs: "30%", sm: "20%" } }} variant="contained" disabled={item.disabled == 1} onClick={() => decline(item)}>Decline</Button>
              </Box>
            </Paper>)
        }
      })}
    </MainLayout>
  )
}

export default Notifications;