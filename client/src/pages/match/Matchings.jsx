import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MainLayout from "../../components/mainLayout";
import { Box, Paper, Typography } from "@mui/material";
import { CheckCircleOutlined } from "@mui/icons-material";

function Matchings() {
  const axiosPrivate = useAxiosPrivate();
  const [myMatchings, setMyMatchings] = useState([]);
  const style = myMatchings.length === 0 ? { display: "flex", justifyContent: "center", alignItems: "center" } : null;
  const grouped = myMatchings.reduce((acc, item) => {
    if (!acc[item.groupid]) acc[item.groupid] = [];

    acc[item.groupid].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const getMatchings = async () => {
      try {
        const res = await axiosPrivate.get('/matchings');
        if (res.data) setMyMatchings(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    getMatchings();
  }, []);

  useEffect(() => {
    document.title = "MyMatchings";
  }, []);

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