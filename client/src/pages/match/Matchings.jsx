import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MainLayout from "../../components/mainLayout";
import { Box, Paper, Typography } from "@mui/material";
import { CheckCircleOutlined } from "@mui/icons-material";
import { useSocket } from "../../context/SocketContext";

function Matchings() {
  const axiosPrivate = useAxiosPrivate();
  const { myMatchings, socket, setMyMatchings } = useSocket();
  const style = myMatchings.length === 0 ? { display: "flex", justifyContent: "center", alignItems: "center" } : null;
  const grouped = myMatchings.reduce((acc, item) => {
    if (!acc[item.groupid]) acc[item.groupid] = [];

    acc[item.groupid].push(item);
    return acc;
  }, {});

  useEffect(() => {
    document.title = "MyMatchings";
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("getUpdateMatchings", (res) => {
      setMyMatchings(prev => prev.map(p => p.groupid == res.groupid && p.userid == res.userid ? { ...p, agrees: 1 } : p));
    });

    socket.on("getDeleteMatching", ({groupid}) => {
      setMyMatchings(prev => prev.filter(p => p.groupid != groupid));
    });

    return () => {
      socket.off("getUpdateMatchings");
      socket.off("getDeleteMatching");
    };
  }, [socket]);

  return (
    <MainLayout mxW="md" paperSx={{ p: 0.8, ...style }}>
      {myMatchings.length === 0 && <Typography>Δεν έχεις επιλεγεί σε κάποια ομάδα.</Typography>}
      {Object.entries(grouped).map(([groupId, members]) => (
        <Paper sx={{ mb: 2, p: 1 }} key={groupId} variant="outlined">
          <Typography>{members.filter(m => Number(m.agrees) === 1).length} / {members.length}</Typography>
          {members.map(member => (
            <Box key={member.rowid} sx={{ display: "inline-block", mr: 2 }}>
              {member.username}
              {Number(member.agrees) === 1 && (<CheckCircleOutlined sx={{ height: "0.8em", width: "0.7em" }} />)}
            </Box>
          ))}
        </Paper>
      ))}
    </MainLayout>
  )
}

export default Matchings;