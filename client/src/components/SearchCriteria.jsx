import { Box, Button, Paper, Typography, Stack, TextField, FormGroup, FormControlLabel, FormControl, Checkbox, Select, InputLabel, MenuItem, Alert } from "@mui/material";
import { scrollbarStyles } from "../pages/styles/scrollbar";

export default function SearchCriteria({ style = {}, submit, change, wrongNumber, criteria, sizeCheck, areaCheck, energyCheck, minMax, incomeCheck, moneyChecked, checkboxOptions, havingArea, selectedArea, areas, papersChecked, otherChecked, formError }) {
    return (
        <Paper variant="outlined" sx={{ width: { xs: "100%", sm: "90%", md: "70%" }, p: 1, bgcolor: "#2835424e", height: "100%", overflowX: "hidden", overflowY: "auto", ...scrollbarStyles }}>
            <Stack spacing={3}>
                <Typography variant="h6">Κριτήρια</Typography>
                <form onSubmit={submit}>
                    <TextField sx={{ ...style }} size="small" label="Μέγεθος οικοπέδου(m²)" name="size" value={criteria.size} onChange={change} error={wrongNumber.size !== ""} helperText={wrongNumber.size} disabled={sizeCheck} required={!sizeCheck} />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="chsize" checked={sizeCheck} disabled={areaCheck} onChange={minMax} />} label="Δεν θέλω" />
                    </FormGroup>

                    <TextField sx={{ ...style }} size="small" label="Ποσότητα PV ενέργειας(kwy)" name="energy" value={criteria.energy} onChange={change} error={wrongNumber.energy !== ""} helperText={wrongNumber.energy} disabled={energyCheck} required={!energyCheck} />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="chenergy" checked={energyCheck} disabled={areaCheck} onChange={minMax} />} label="Δεν θέλω" />
                    </FormGroup>

                    <TextField sx={{ ...style }} size="small" label="Ποσοστό εσόδων" name="income" value={criteria.income} onChange={change} error={wrongNumber.income !== ""} helperText={wrongNumber.income} disabled={incomeCheck} required={!incomeCheck} />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="chincome" checked={incomeCheck} onChange={minMax} />} label="Δεν θέλω" />
                    </FormGroup>

                    <TextField sx={{ ...style }} size="small" label="Χρήματα" name="money" value={criteria.money} onChange={change} error={wrongNumber.money !== ""} helperText={wrongNumber.money} disabled={moneyChecked} required={!moneyChecked} />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="chmoney" checked={moneyChecked} onChange={minMax} />} label="Δεν θέλω" />
                    </FormGroup>

                    <Box sx={{ display: "flex", width: "100%" }}>
                        <FormControlLabel control={<Checkbox size="small" name="area" disabled={!havingArea} checked={areaCheck} onChange={checkboxOptions} />} label="Έκταση" />
                        <FormControl fullWidth>
                            <InputLabel id="areaid">Έκταση</InputLabel>
                            <Select
                                labelId="areaid"
                                size="small"
                                required sx={{ width: "100%", ...style }}
                                name="areaid"
                                label="Έκταση"
                                value={selectedArea}
                                onChange={change}
                                disabled={!areaCheck}
                            >
                                {areas.map((area) => {
                                    return (<MenuItem key={area.areaid} value={area.areaid}>{area.name}</MenuItem>);
                                })}
                            </Select>
                        </FormControl>
                    </Box>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="papers" checked={papersChecked} onChange={checkboxOptions} />} label="Διαδικαστικά" />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="small" name="other" checked={otherChecked} onChange={checkboxOptions} />} label="Άλλο" />
                    </FormGroup>

                    {formError && <Alert severity="error">{formError}</Alert>}
                    <Button fullWidth type="submit" variant="contained">Αναζήτηση</Button>

                </form>
            </Stack>
        </Paper>
    );
}