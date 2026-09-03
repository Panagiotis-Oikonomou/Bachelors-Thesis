import { useParams } from "react-router-dom";
import useManageArea from "../../hooks/useManageArea";
import MainLayout from "../../components/mainLayout";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useEffect } from "react";

function ManageArea() {
  const { id } = useParams();
  const { areaData, nameError, formError, areaUpdated, handleChange, handleSubmit, numberError } = useManageArea(id);

  useEffect(() => {
    document.title = "ManageArea";
  }, []);

  return (
    <MainLayout mxW="xs" paperSx={{ p: { xs: 2, sm: 3 }, alignContent: { xs: "start", sm: "center" } }} boxSx={{ pb: { xs: 0, sm: 24 }, pt: { xs: 0, sm: 10 } }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField label="Όνομα περιοχής" name="name" value={areaData.name} onChange={handleChange} error={nameError !== ""} helperText={nameError} required />

          <TextField label="Μέγεθος έκτασης(m²)" name="size" value={areaData.size} onChange={handleChange} error={numberError !== ""} helperText={numberError} required />

          <TextField label="Συστεταγμένες(lat, lng)" value={`${Number(areaData.lat).toFixed(4)}, ${Number(areaData.lng).toFixed(4)}`} slotProps={{ input: { readOnly: true } }} required />

          <TextField label="Ετήσια παραγωγή ηλεκτρικής ενέργειας(kWh/year)" name="ac" value={areaData.ac} slotProps={{ input: { readOnly: true } }} required />

          {formError && (<Alert severity="error">{formError}</Alert>)}
          {areaUpdated && (<Alert severity="success">{areaUpdated}</Alert>)}
          <Button type="submit" size="small" variant="contained">Αποθήκευση αλλαγών</Button>
        </Stack>
      </form>
    </MainLayout>
  )
}

export default ManageArea;