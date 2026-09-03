import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, AppBar, Toolbar, Avatar, IconButton } from "@mui/material";
import { AccountCircleOutlined, AreaChartOutlined, ChatOutlined, DescriptionOutlined, Groups2Outlined, JoinInnerOutlined, MenuOutlined, NotificationsOutlined } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationsContext";

export default function Layout() {
  const { auth } = useAuth();
  const { globalNotifications } = useNotifications();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuItems = [
    {
      text: "My Matchings",
      icon: <Groups2Outlined />,
      path: "/matchings"
    },
    {
      text: "My Fields",
      icon: <AreaChartOutlined />,
      path: "/my_areas"
    },
    {
      text: "My Criteria",
      icon: <DescriptionOutlined />,
      path: "/criteria"
    },
    {
      text: "Match",
      icon: <JoinInnerOutlined />,
      path: "/match"
    },
    {
      text: "My Chats",
      icon: <ChatOutlined />,
      path: "/my_chats"
    },
    {
      text: globalNotifications > 0 ? "Notifications " + globalNotifications : "Notifications",
      icon: <NotificationsOutlined />,
      path: "/notifications"
    },
    {
      text: "Profile",
      icon: <AccountCircleOutlined />,
      path: "/profile"
    }
  ];
  const DrawerList = (
    <Box>
      <List>
        {menuItems.map(item => (
          <ListItem key={item.text} sx={{ cursor: "pointer", background: location.pathname === item.path ? "#3c6bb2" : "" }} disablePadding>
            <ListItemButton onClick={() => { navigate(item.path); toggleDrawer(false); }}>
              <ListItemIcon sx={{ color: globalNotifications > 0 && item.path === "/notifications" ? "red" : "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: globalNotifications > 0 && item.path === "/notifications" ? "red" : "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    if (auth?.accessToken) setUsername(jwtDecode(auth.accessToken).username);
  }, [auth]);

  function toggleDrawer(newOpen) {
    setOpen(newOpen);
  }

  return (
    <Box style={{ display: "flex", height: "100vh", overflow: "hidden", }}>

      <AppBar position="fixed" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", }}>
        <Toolbar disableGutters sx={{ p: { xs: 0.2, sm: 1 } }}>
          <IconButton onClick={() => toggleDrawer(!open)} sx={{ p: 0, }}>
            <MenuOutlined />
          </IconButton>
          <Typography variant="body1" sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.3rem" } }}>Energy Community</Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: "1rem", sm: "1.3rem" } }}>{username}</Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" anchor="left" open={open} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}