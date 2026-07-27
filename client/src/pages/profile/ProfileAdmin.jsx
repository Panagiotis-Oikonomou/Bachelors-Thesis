import { scrollbarStyles } from "../styles/scrollbar";
import useAdminProfile from "../../hooks/useAdminProfile";
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, Stack, TextField } from "@mui/material";
import MainLayout from "../../components/mainLayout";
import { useEffect } from "react";

function ProfileAdmin() {
  const {
    data, conPass, errors, cpswError, cpswMatch, cpswRequired, allError,
    saved, showPassword, setShowPassword, showConfPassword, setShowConfPassword,
    handleChange, handleSubmit, signOut,
  } = useAdminProfile();

  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
    <MainLayout mxW="md">
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={3}>
          <Button variant="contained" sx={{ width: { xs: "30%", sm: "15%" }, alignSelf: "end", bgcolor: "#ca2d2d", ":hover": { bgcolor: "#d35252" } }} onClick={signOut}>Logout</Button>
          <TextField
            label="Όνομα" name="fname"
            value={data.fname}
            onChange={handleChange}
            error={errors.fname !== ""}
            helperText={errors.fname}
            fullWidth required size="small"
          />

          <TextField
            label="Επώνυμο" name="lname"
            value={data.lname}
            onChange={handleChange}
            error={errors.lname !== ""}
            helperText={errors.lname}
            fullWidth required size="small"
          />

          <TextField
            label="Email" name="email"
            value={data.email} type="email"
            onChange={handleChange}
            error={errors.email !== ""}
            helperText={errors.email}
            fullWidth required size="small"
          />

          <TextField
            label="Username" name="username"
            value={data.username}
            onChange={handleChange}
            error={errors.username !== ""}
            helperText={errors.username}
            fullWidth required size="small"
          />

          <TextField
            label="Password" name="password"
            value={data.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            error={errors.password !== ""}
            helperText={errors.password}
            fullWidth size="small"
          />
          <FormGroup >
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
            fullWidth required={cpswRequired} size="small"
          />

          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox onChange={() => setShowConfPassword(!showConfPassword)} />} label="Εμφάνιση κωδικού" />
          </FormGroup>

          {allError && (<Alert severity="error" icon={false}>{allError}</Alert>)}
          {saved && (<Alert severity="success" icon={false}>{saved}</Alert>)}

          <Button type="submit" variant="contained" >Αποθήκευση αλλαγών</Button>
        </Stack>
      </form>
    </MainLayout>
  );
}
export default ProfileAdmin;