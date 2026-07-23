import { Container, Box, Paper } from "@mui/material";
import { scrollbarStyles } from "../pages/styles/scrollbar";

export default function MainLayout({ children, containerSx = {}, boxSx = {}, paperSx = {}, mxW }) {
  return (
    <Container maxWidth={mxW} sx={{ p:{xs:0}, ...containerSx, }} >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ...boxSx}}>
        <Paper
          variant="outlined" square={false}
          sx={{
            width: "100%",
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