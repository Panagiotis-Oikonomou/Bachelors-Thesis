import { useState, useEffect } from "react";
import MyComponent from "../../components/maps/MyComponent";
import useAddArea from "../../hooks/useAddArea";
import theme from "../../theme/theme";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetEnergy from "../../hooks/useGetEnergy";
import MainLayout from "../../components/mainLayout";
import { Alert, Box, Button, IconButton, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { MapOutlined } from "@mui/icons-material";

function AddArea() {
  const axiosPrivate = useAxiosPrivate();
  const [location, setLocation] = useState(null);
  const { areaData, setAreaData, nameError, formError, handleChange, handleSubmit, numberError, setFormError } = useAddArea();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (location) {
      setAreaData(prev => ({
        ...prev,
        lat: location.lat.toFixed(6),
        lng: location.lng.toFixed(6)
      }));
    }
  }, [location]);

  useGetEnergy(setAreaData, areaData.size, areaData.lat, areaData.lng, setFormError);

  return (
    <MainLayout mxW="xl" containerSx={{ p: { xs: 0 } }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, height: { xs: "99dvh", sm: "58dvh", md: "69dvh" }, width: "100%" }}>
        <Box component="form" autoComplete="off" onSubmit={handleSubmit} sx={{ width: { xs: "100%", sm: "40%" } }}>
          <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Typography variant="h5">Δημιουργία καινούργιας περιοχής</Typography>
            <TextField size={isMobile ? "small" : "medium"} fullWidth label="Όνομα περιοχής" name="name" value={areaData.name} onChange={handleChange} error={nameError !== ""} helperText={nameError} required />

            <TextField size={isMobile ? "small" : "medium"} fullWidth label="Έκταση περιοχής(m²)" name="size" value={areaData.size} onChange={handleChange} error={numberError !== ""} helperText={numberError} required />

            <TextField size={isMobile ? "small" : "medium"} fullWidth label="Coordinates(lat, lng)" name="coordinates" value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""} slotProps={{ input: { readOnly: true } }} required />
            <IconButton sx={{ alignSelf: "start" }} onClick={() => setOpen(!open)}><MapOutlined /></IconButton>

            <TextField size={isMobile ? "small" : "medium"} fullWidth label="Ετήσια παραγωγή PV ενέργειας(kWy)" name="ac" value={areaData.ac} slotProps={{ input: { readOnly: true } }} required />

            {formError && (<Alert severity="error">{formError}</Alert>)}
            <Button type="submit" size={isMobile ? "small" : "medium"} fullWidth variant="contained">Δημιουργία</Button>
          </Stack>
        </Box>

        {!open && (
          <Box sx={{ flex: 1, height: "100%", width: "100%", alignContent: "center", alignSelf: "center" }}>
            <Typography sx={{ textAlign: "center" }}>Άνοιξε τον χάρτη</Typography>
          </Box>
        )}

        {open && (
          <Box sx={{ flex: 1, height: "100%", width: { xs: "100%", sm: "60%" } }}>
            <MapContainer key="map" center={[38, 23]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MyComponent setLocation={setLocation} />
              {location && (
                <Marker position={[location.lat, location.lng]}></Marker>
              )}
            </MapContainer>
          </Box>
        )}
      </Box>
    </MainLayout>
  )
}
export default AddArea;