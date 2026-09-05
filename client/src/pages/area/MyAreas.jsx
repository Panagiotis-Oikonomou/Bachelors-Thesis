import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import MainLayout from "../../components/mainLayout";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { AddCircleOutlined } from "@mui/icons-material";
import styles from "../../assets/css/links.module.css";
import { scrollbarStyles } from "../styles/scrollbar";

function MyAreas() {
  const axiosPrivate = useAxiosPrivate();
  const [search, setSearch] = useState('');
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);

  useEffect(() => {
    const getAreas = async () => {
      try {
        const res = await axiosPrivate.get('/areas');
        if (res.data) {
          setFilteredAreas(res.data);
          setAreas(res.data);
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    getAreas();
  }, []);

  async function deleteArea(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`/areas/${id}`);
      setAreas(prev => prev.filter(a => a.areaid !== id));
      setFilteredAreas(prev => prev.filter(a => a.areaid !== id));
    }
    catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  function searchArea(value) {
    setSearch(value);

    if (value == "") setFilteredAreas(areas);

    else setFilteredAreas(areas.filter(a => a.name.toLowerCase().includes(value.toLowerCase())));
  }

  useEffect(() => {
    document.title = "MyAreas";
  }, []);

  return (
    <MainLayout mxW="md">
      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", gap: 1 }}>
          <TextField type="search" label="Search field" size="small" value={search} onChange={(e) => searchArea(e.target.value)} />
          <Typography sx={{ display: "flex", alignSelf: { xs: "start", sm: "center" } }}>Νέα έκταση <Link to='/add_area' className={styles.link}><AddCircleOutlined /></Link></Typography>
        </Box>

        <Paper sx={{
          height: { xs: "77dvh", sm: "79dvh" }, ...scrollbarStyles,
          overflowY: "auto", width: "100%",
        }} variant="outlined" square={false} >
          {filteredAreas.map((id) => (
            <Paper key={id.areaid} sx={{ mb: 2, p: 2, width: "100%", }}>
              <Link to={`/manage_area/${id.areaid}`} className={styles.linkNoColor}>
                <Typography>Όνομα οικοπέδου: {id.name}</Typography>

                <Typography>Μέγεθος οικοπέδου: {id.size}m²</Typography>

                <Typography>Γεωγραφικό πλάτος: {id.lat}</Typography>

                <Typography>Γεωγραφικό μήκος: {id.lng}</Typography>

                <Typography>Ποσότητα ηλεκτρικής ενέργειας: {id.ac} kWh/year</Typography>
              </Link>
              <Button sx={{ mt: 1, bgcolor: "#ca2d2d", ":hover": { bgcolor: "#d35252" } }} variant="contained" onClick={() => deleteArea(id.areaid)}>Διαγραφή</Button>
            </Paper>
          ))}
        </Paper>
      </Stack>
    </MainLayout>
  )
}
export default MyAreas;