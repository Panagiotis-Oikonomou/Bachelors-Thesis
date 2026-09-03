import { Box, IconButton, Paper, Typography, Stack} from "@mui/material";
import { scrollbarStyles } from "../pages/styles/scrollbar";
import { CancelOutlined, CheckCircleOutlined } from "@mui/icons-material";

export default function SearchedUsers({ style = {}, nextUser, addUser, visibleUser }) {
    return (
        <Paper variant="outlined" sx={{ width: { xs: "100%", sm: "90%", md: "70%" }, alignItems: "flex-start", p: 1, bgcolor: "#2835424e", height: "100%", ml: "auto", overflowX: "hidden", overflowY: "auto", ...scrollbarStyles }}>
            {!visibleUser && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography>Ψάξε με κριτήρια άλλους χρήστες.</Typography>
                </Box>
            )}
            <Stack spacing={2}>
                {visibleUser && (
                    <>
                        <Box sx={{minHeight:"300px"}}>
                            {visibleUser.username !== null && (<>Username: {visibleUser.username}<br /><br /></>)}

                            {<>Περιοχή:{visibleUser.areaid === null ? " Όχι" : " Ναι"}<br /></>}

                            {visibleUser.areaid !== null && (
                                <>
                                    Μέγεθος έκτασης: {visibleUser.size}m²<br />
                                    Ποσότητα ηλεκτρικής ενέργειας: {visibleUser.ac}(kWh/year)<br />
                                </>)}<br />

                            Ζήτηση και Προσφορά<br />
                            {visibleUser.areasize !== null && (<>Μέγεθος έκτασης: {visibleUser.areasize}m²<br /></>)}

                            {visibleUser.energy !== null && (<>Ποσότητα ηλεκτρικής ενέργειας: {visibleUser.energy}(kWh/year)<br /></>)}

                            {visibleUser.income !== null && (<>Ποσοστό εσόδων: {visibleUser.income}%<br /></>)}

                            {visibleUser.money !== null && (<>Χρήματα: {visibleUser.money}<br /></>)}

                            Χαρτιά: {visibleUser.papers !== null && visibleUser.papers ? "Ναι" : "Όχι"}<br />

                            Άλλα: {visibleUser.other !== null && visibleUser.other ? "Ναι" : "Όχι"}<br />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", alignSelf: "flex-start", }}>
                            Όχι<IconButton sx={{ color: "red" }} onClick={nextUser}><CancelOutlined /></IconButton>
                            Ναι<IconButton sx={{ color: "green" }} onClick={() => addUser(visibleUser)}><CheckCircleOutlined /></IconButton>
                        </Box>
                    </>
                )}

            </Stack>
        </Paper>
    );
}