import { Box, IconButton, Paper, Typography } from "@mui/material";
import { scrollbarStyles } from "../pages/styles/scrollbar";
import { CancelOutlined, CheckCircleOutlined } from "@mui/icons-material";

export default function WaitingToDelete({ waitingDelete, changeWaitingDelete, userId, style = {} }) {
  return (

    <Paper variant="outlined" sx={{ gap: 1, width: "100%", p: 0.5, display: "flex", flexDirection: { xs: "column", md: "row" }, overflowX: { md: "auto" }, overflowY: { xs: "auto", md: "hidden" }, ...style, ...scrollbarStyles }}>
      {waitingDelete.map((item) => (
        <Box key={item.delid} sx={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: "fit-content", gap: 0.5 }}>{item.username}
          {item.userid == userId && (
            <Box sx={{ display: "flex", gap: 0 }}>
              <IconButton sx={{ color: "green", cursor: item.destroy === 1 ? "not-allowed" : "pointer", p: 0 }} onClick={() => changeWaitingDelete(1)}><CheckCircleOutlined /></IconButton>
              <IconButton sx={{ color: "red", cursor: item.destroy === 0 ? "not-allowed" : "pointer", }} onClick={() => changeWaitingDelete(0)}><CancelOutlined /></IconButton>
            </Box>
          )}
          {item.userid != userId && (
            <Typography component="span" sx={{ ml: "auto" }}>{item.destroy == 0 ? (<IconButton disabled><CancelOutlined sx={{ color: "red", }} /></IconButton>) : (<IconButton disabled><CheckCircleOutlined sx={{ color: "green", }} /></IconButton>)}</Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}