import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../assets/css/links.module.css";
import axios from "../../api/axios";
import resetTimer from "../../utils/resetTimer";
import { Alert, Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Paper, Stack, TextField, Typography } from "@mui/material";

function Login() {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [notFound, setNotFound] = useState("");
  const [loginData, setLoginData] = useState({
    usr: "",
    psw: ""
  });

  useEffect(() => {
    resetTimer(notFound, setNotFound);
  }, [notFound]);

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])

  function handleSubmit(e) {
    e.preventDefault();

    axios.post('/public/login', { usr: loginData.usr, psw: loginData.psw, persist })
      .then((res) => {
        if (res.data.exists) {
          const accessToken = res.data?.accessToken;
          const isAdmin = res.data?.isAdmin;
          setAuth({ accessToken });
          if (isAdmin) {
            if (from !== "/") {
              navigate(from, { replace: true });
            }
            else navigate('/profile/admin', { replace: true });
          }
          else {
            if (from !== "/") {
              navigate(from, { replace: true });
            }
            else navigate('/profile', { replace: true });
          }
        }
        else {
          setNotFound("Το username ή ο κωδικός είναι λάθος.");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Paper sx={{
          p: { xs: 2, sm: 4 }, width: "100%",
          maxWidth: 450, bgcolor: "transparent",
          color: "white", 
          border: "1px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.05)"
        }}
          variant="outlined" square={false}
        >
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Sign in</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                fullWidth required
                autoFocus
                onChange={(e) => { setLoginData({ ...loginData, usr: e.target.value }) }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth required
                onChange={(e) => { setLoginData({ ...loginData, psw: e.target.value }) }}
              />

              <FormGroup>
                <FormControlLabel control={<Checkbox onChange={() => setShowPassword(!showPassword)} />} label="Εμφάνιση κωδικού" />
                <FormControlLabel control={<Checkbox onChange={togglePersist} checked={persist} />} label="Trust this device" />
              </FormGroup>

              {notFound && (<Alert severity="error" icon={false}>{notFound}</Alert>)}

              <Button type="submit" variant="contained" >Σύνδεση</Button>
              <Typography variant="body2">Δεν έχεις λογαριασμό; κάνε <Link to='/register' className={styles.link}>Εγγραφή</Link></Typography>
              <Typography variant="body2"><Link to='/' className={styles.link}>Αρχική</Link></Typography>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;