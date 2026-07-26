import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import MainLayout from "../../components/mainLayout";
import useCriteria from "../../hooks/useCriteria";

function Criteria() {
  const { criteria, formError, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
    isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked,
    isAreaChecked, isMoneyChecked, isPapersChecked, isOtherChecked, areas,
    havingArea, formSuccess, checkboxOptions, handleSubmit, wrongNumber, areaValue
  } = useCriteria();

  const style = { "& .MuiOutlinedInput-input": { py: 0.30, }, };

  return (
    <MainLayout mxW="md" paperSx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", sm: "1.2rem" }, mb: 2 }}>Βάλε από ένα εύρος τιμών για το τι θέλεις</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <TextField sx={{ ...style }} size="small" label="Έκταση περιοχής(m²)" name="size" value={criteria.size} onChange={handleChange} error={wrongNumber.size !== ""} helperText={wrongNumber.size} disabled={isSizeChecked} required={!isSizeChecked} />
          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox size="small" name="chsize" checked={isSizeChecked} disabled={isAreaChecked} onChange={setMinMaxToZero} />} label="Δεν θέλω" />
          </FormGroup>

          <TextField sx={{ ...style }} size="small" label="Ποσότητα PV ενέργειας(kwy)" name="energy" value={criteria.energy} onChange={handleChange} error={wrongNumber.energy !== ""} helperText={wrongNumber.energy} disabled={isEnergyChecked} required={!isEnergyChecked} />
          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox size="small" name="chenergy" checked={isEnergyChecked} disabled={isAreaChecked} onChange={setMinMaxToZero} />} label="Δεν θέλω" />
          </FormGroup>

          <TextField sx={{ ...style }} size="small" label="Ποσοστό εσόδων" name="income" value={criteria.income} onChange={handleChange} error={wrongNumber.income !== ""} helperText={wrongNumber.income} disabled={isIncomeChecked} required={!isIncomeChecked} />
          <FormGroup>
            <FormControlLabel sx={{ mt: -2 }} control={<Checkbox size="small" name="chincome" checked={isIncomeChecked} onChange={setMinMaxToZero} />} label="Δεν θέλω" />
          </FormGroup>

          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}>Τι προσφέρω:</Typography>
          <FormControl>
            <FormControlLabel control={<Checkbox size="small" name="moneyM" checked={isMoneyChecked} onChange={checkboxOptions} />} label="Χρήματα" />
            <TextField sx={{ ...style }} size="small" label="Χρήματα" name="money" value={criteria.money} onChange={handleChange} error={wrongNumber.money !== ""} helperText={wrongNumber.money} disabled={!isMoneyChecked} required={isMoneyChecked} />

            <FormControlLabel control={<Checkbox size="small" name="area" disabled={!havingArea} checked={isAreaChecked} onChange={checkboxOptions} />} label="Έκταση" />
            <FormControl>
              <InputLabel id="areaid">Έκταση</InputLabel>
              <Select
                labelId="areaid"
                size="small"
                required sx={{ ...style }}
                name="areaid"
                label="Έκταση"
                value={areaValue}
                onChange={handleChange}
                disabled={!isAreaChecked}
              >
                {areas.map((area) => {
                  return (<MenuItem key={area.areaid} value={String(area.areaid)}>{area.name}</MenuItem>);
                })}
              </Select>
            </FormControl>

            <FormControlLabel control={<Checkbox size="small" name="papers" checked={isPapersChecked} onChange={checkboxOptions} />} label="Διαδικαστικά" />

            <FormControlLabel control={<Checkbox size="small" name="other" checked={isOtherChecked} onChange={checkboxOptions} />} label="Άλλο" />
          </FormControl>

          {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
          {formError && <Alert severity="error">{formError}</Alert>}
          <Button type="submit" variant="contained">Αποθήκευση αλλαγών</Button>
        </Stack>
      </form>
    </MainLayout>

  )
}

export default Criteria;