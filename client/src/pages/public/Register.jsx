import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/links.module.css";
import { scrollbarStyles } from "../styles/scrollbar";
import useRegister from "../../hooks/useRegister";
import { Alert, Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import MainLayout from "../../components/MainLayout";

function Register() {
  const {
    formData, conPass, errors, providers, cpswError, cpswMatch,
    allError, showConfPassword, showPassword, setShowConfPassword,
    setShowPassword, handleChange, handleSubmit } = useRegister();
  return (
    <MainLayout mxW="md" paperSx={{ p: { xs: 1, sm: 3 }, height: { xs: "100dvh", }, }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Sign up</Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={3}>
          <TextField
            label="Όνομα" name="fname"
            value={formData.fname}
            onChange={handleChange}
            error={errors.fname !== ""}
            helperText={errors.fname}
            fullWidth required
            autoFocus
          />

          <TextField
            label="Επώνυμο" name="lname"
            value={formData.lname}
            onChange={handleChange}
            error={errors.lname !== ""}
            helperText={errors.lname}
            fullWidth required
          />

          <TextField
            label="Αριθμός ρολογιού" name="clock"
            value={formData.clock}
            onChange={handleChange}
            error={errors.clock !== ""}
            helperText={errors.clock}
            fullWidth required
          />

          <FormControl>
            <InputLabel id="providerLabel">Πάροχος ενέργειας</InputLabel>
            <Select
              labelId="providerLabel"
              required sx={{ width: 200 }}
              name="provider"
              label="Πάροχος ενέργειας"
              value={formData.provider}
              onChange={handleChange}
            >
              {providers.map((provider) => {
                return (<MenuItem key={provider.providerid} value={provider.providername}>{provider.providername}</MenuItem>);
              })}
            </Select>
          </FormControl>

          <TextField
            label="Email" name="email"
            value={formData.email} type="email"
            onChange={handleChange}
            error={errors.email !== ""}
            helperText={errors.email}
            fullWidth required
          />

          <TextField
            label="Username" name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username !== ""}
            helperText={errors.username}
            fullWidth required
          />

          <TextField
            label="Password" name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            error={errors.password !== ""}
            helperText={errors.password}
            fullWidth required
          />
          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox onChange={() => setShowPassword(!showPassword)} />} label="Εμφάνιση κωδικού" />
          </FormGroup>

          <TextField
            label="Confirm Password" name="cpsw"
            value={conPass} onChange={handleChange}
            type={showConfPassword ? "text" : "password"}
            error={cpswError !== ""}
            helperText={cpswError || cpswMatch}
            slotProps={{
              formHelperText: {
                sx: {
                  color: cpswError
                    ? "error.main"
                    : cpswMatch
                      ? "success.main"
                      : "text.secondary",
                },
              }
            }}
            fullWidth required
          />

          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox onChange={() => setShowConfPassword(!showConfPassword)} />} label="Εμφάνιση κωδικού" />
          </FormGroup>

          {allError && (<Alert severity="error" icon={false}>{allError}</Alert>)}

          <Button type="submit" variant="contained" >Εγγραφή</Button>
          <Typography variant="body2">Έχεις λογαριασμό; κάνε <Link to='/login' className={styles.link}>Σύνδεση</Link></Typography>
          <Typography variant="body2"><Link to='/' className={styles.link}>Αρχική</Link></Typography>
        </Stack>
      </form>
    </MainLayout>
  )
}
export default Register;