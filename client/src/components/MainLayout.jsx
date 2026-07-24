import { Container, Box, Paper } from "@mui/material";
import { scrollbarStyles } from "../pages/styles/scrollbar";

export default function MainLayout({ children, containerSx = {}, boxSx = {}, paperSx = {}, mxW }) {
  return (
    <Container maxWidth={mxW} sx={{ p:0, flex:1, display:"flex", minHeight:0, overflow:"hidden",...containerSx, }} >
      <Box sx={{ flex:1, display: "flex", minHeight:0, overflow:"hidden", ...boxSx}}>
        <Paper
          variant="outlined" square={false}
          sx={{
            width: "100%", minHeight:0, flex:1,
            p: { xs: 1, sm: 2 }, overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(255,255,255,0.05)",
            ...scrollbarStyles, ...paperSx,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Container>
  );
}