import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FeatureCard from "../../components/FeatureCard";
import styles from "../../assets/css/links.module.css";
import foto from "../../assets/images/foto.jpg";
import chat from "../../assets/images/chat.png";
import algo from "../../assets/images/algo.jpg";
import field from "../../assets/images/field.jpg";
import criteria from "../../assets/images/criteria.jpg";
import { useEffect } from "react";

function Index() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ p: { xs: 0.5, sm: 1 }, }}>
      <Box sx={{
        display: "flex", flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex_start", sm: "center" },
        py: 2, gap: 2
      }}>
        <Typography variant="h4">Energy Community</Typography>
        <Stack direction="row" spacing={2} sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}>
          <Paper variant="outlined" sx={{ p: 1, backgroundColor: "#193e76", ":hover": { backgroundColor: "#3c6bb2" } }}>
            <Link to='/login' className={styles.link}>Sign in</Link>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1, backgroundColor: "#193e76", ":hover": { backgroundColor: "#3c6bb2" } }}>
            <Link to='/register' className={styles.link}>Sign up</Link>
          </Paper>
        </Stack>
      </Box>

      <Grid container spacing={2} >
        <Grid size={{ xs: 12, md: 6 }}>
          <FeatureCard text={"Βρες άλλους ενδιαφερόμενους χρήστες για την δημιουργία μίας ενεργειακής κοινότητας. Μέσα από την συνεργασία παράξτε ηλιακή ενέργεια και πουλήστε την για το ομαδικό σας κέρδος."}
            image={foto} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} >
          <FeatureCard text={"Βρείτε τους χρήστες που θέλετε να είναι στην ομάδα σας ή αφήστε τον αλγόριθμό μας να το κάνει για εσάς, προτείνοντάς σας τα πιο κατάλληλα μέλη με βάση τα κριτήρια και τις προτιμήσεις σας."}
            image={algo} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} >
          <FeatureCard text={"Προσθέστε τα κριτήρια που θέλετε να ισχύουν για εσάς, ώστε να συμμετέχετε μόνο σε ομάδες που ανταποκρίνονται στις ανάγκες και τις προτιμήσεις σας."}
            image={criteria}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} >
          <FeatureCard text={"Προσθέστε τις διαθέσιμες περιοχές ή εκτάσεις που διαθέτετε, ώστε να μπορούν να αξιοποιηθούν από την ομάδα σας για την εγκατάσταση και λειτουργία των ενεργειακών υποδομών."}
            image={field} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} >
          <FeatureCard text={"Επικοινωνήστε άμεσα με τα μέλη της ομάδας σας μέσω ενός real-time chat, ανταλλάξτε ιδέες, συντονίστε τις ενέργειές σας και μείνετε πάντα ενημερωμένοι για κάθε εξέλιξη."}
            image={chat} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Index;