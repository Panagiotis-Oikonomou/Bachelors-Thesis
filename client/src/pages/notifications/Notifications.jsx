import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import MainLayout from "../../components/mainLayout";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

function Notifications() {
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = useState([]);

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
    getNotifications();
  }, []);

  async function changeToRead(id) {
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
      await axiosPrivate.put('/matchings', { notid: id, agrees: 1 });
    }
    catch (err) {
      console.log(err);
    }
  }

  async function decline(id) {
    setDisabled(id);

    try {
      await axiosPrivate.put(`/notifications/disabled/${id}`);
      await axiosPrivate.put('/matchings', { notid: id, agrees: 0 });
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <MainLayout mxW="sm">
      {notifications.map((item) => {
        if (item.type === "info") {
          return (
            <Paper key={item.notid} sx={{ mb: 3, border: 1, borderColor: item.is_read ? 'white' : 'red' }} onClick={() => changeToRead(item.notid)}>
              <Box sx={{ ...commonSx }}>
                <Typography sx={{ whiteSpace: item.expanded ? "pre-wrap" : "normal", ...extraMessageSx, ...(!item.expanded && messageOpenSx), }}>{item.message}</Typography>

                <IconButton onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }}><CloseOutlined /></IconButton>
              </Box>
            </Paper>)
        }
        else if (item.type === "conf") {
          return (
            <Paper key={item.notid} sx={{ mb: 3, border: 1, borderColor: item.is_read ? 'white' : 'red' }} onClick={() => changeToRead(item.notid)}>
              <Box sx={{ ...commonSx }}>
                <Typography sx={{ whiteSpace: item.expanded ? "pre-wrap" : "normal", ...extraMessageSx, ...(!item.expanded && messageOpenSx), }}>{item.message}</Typography>
                <IconButton onClick={(e) => { e.stopPropagation(); deleteNotification(item.notid) }}><CloseOutlined /></IconButton>
              </Box>
              <Box sx={{ p: 2, }}>
                <Button sx={{ bgcolor: "#4be675", mr: 1, width: "20%" }} variant="contained" disabled={item.disabled == 1} onClick={() => accept(item.notid)}>Accept</Button>
                <Button sx={{ bgcolor: "#c42828", width: "20%" }} variant="contained" disabled={item.disabled == 1} onClick={() => decline(item.notid)}>Decline</Button>
              </Box>
            </Paper>)
        }
      })}
    </MainLayout>
  )
}

export default Notifications;