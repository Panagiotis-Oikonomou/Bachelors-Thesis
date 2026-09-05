import useMatch from "../../hooks/useMatch";
import MainLayout from "../../components/mainLayout";
import { Box, Button, IconButton, Paper, Popper, useTheme, useMediaQuery, ClickAwayListener } from "@mui/material";
import { CancelOutlined, GroupAddOutlined, SearchOutlined } from "@mui/icons-material";
import { scrollbarStyles } from "../styles/scrollbar";
import SearchCriteria from "../../components/SearchCriteria";
import SearchedUsers from "../../components/SearchedUsers";

function Match() {
  const { criteria, isSizeChecked, isEnergyChecked, isIncomeChecked, isMoneyChecked, isPapersChecked,
    isOtherChecked, checkboxOptions, formError, handleChange, handleSearchSubmit, setMinMaxToZero,
    isAreaChecked, havingArea, areas, selectedArea, handleCreationSubmit, users, removeSelectedUser,
    addUser, visibleUser, nextUser, hoveredUser, setHoveredUser, wrongNumber, openSearch,
    setOpenSearch, openSearchedUsers, setOpenSearchedUsers, } = useMatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <MainLayout mxW="xl" containerSx={{ p: { xs: 0 } }} paperSx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "89dvh", gap: 2, }}>
        <Box sx={{ display: "flex", height: "10%" }}>
          <Paper variant="outlined" sx={{ width: "100%", bgcolor: "#2835424e", p: 2, overflowX: "auto", overflowY: "hidden", ...scrollbarStyles }}>
            <ClickAwayListener onClickAway={() => setHoveredUser(null)}>
              <Box sx={{ display: "flex", gap: 2, }}>
                {users.map((user, index) => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} key={index}
                    onMouseEnter={
                      !isMobile
                        ? (e) => {
                          const anchor = e.currentTarget;
                          setHoveredUser({ user, anchor })
                        }
                        : undefined
                    }
                    onMouseLeave={!isMobile ? () => setHoveredUser(null) : undefined}
                    onClick={
                      isMobile
                        ? (e) => {
                          const anchor = e.currentTarget;
                          setHoveredUser((prev) => prev?.user.userid === user.userid
                            ? null
                            : { user, anchor })
                        }
                        : undefined
                    }>
                    {user.username} {index > 0 && (<IconButton sx={{ cursor: "pointer" }} onClick={() => removeSelectedUser(index)}><CancelOutlined /></IconButton>)}
                  </Box>
                ))}

                <Popper open={Boolean(hoveredUser)} anchorEl={hoveredUser?.anchor} placement="bottom" modifiers={[{ name: "offset", options: { offset: [0, 8] } }]} sx={{ zIndex: 9999, pointerEvents: isMobile ? "auto" : "none" }} disablePortal={false}>
                  {(hoveredUser && hoveredUser.user.userid !== users[0].userid) && (
                    <Paper sx={{ p: 1, borderRadius: 1, minWidth: 220, bgcolor: "#222" }}>
                      <>Οικόπεδο:{hoveredUser.user.areaid === null ? " Όχι" : " Ναι"}<br /></>

                      {hoveredUser.user.areaid !== null && (
                        <>
                          Μέγεθος οικοπέδου: {hoveredUser.user.size}m²<br />
                          Ποσότητα ηλεκτρικής ενέργειας: {hoveredUser.user.ac}(kWh/year)<br />
                        </>)}<br />

                      Ζήτηση και Προσφορά<br />

                      {hoveredUser.user.areasize !== null && (<>Μέγεθος οικοπέδου: {hoveredUser.user.areasize}m²<br /></>)}

                      {hoveredUser.user.energy !== null && (<>Ποσότητα ηλεκτρικής ενέργειας: {hoveredUser.user.energy}(kWh/year)<br /></>)}

                      {hoveredUser.user.income !== null && (<>Ποσοστό εσόδων: {hoveredUser.user.income}<br /></>)}

                      {hoveredUser.user.money !== null && (<>Χρήματα: {hoveredUser.user.money}<br /></>)}

                      Χαρτιά: {hoveredUser.user.papers !== null && hoveredUser.user.papers ? "Ναι" : "Όχι"}<br />

                      Άλλα: {hoveredUser.user.other !== null && hoveredUser.user.other ? "Ναι" : "Όχι"}<br />
                    </Paper>
                  )}
                </Popper>
                <Box component="form" sx={{ position: "relative", display: "flex", alignItems: "center" }} onSubmit={handleCreationSubmit}><Button type="submit" variant="contained">Δημιουργία</Button></Box>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Box>
        <Box sx={{ display: { sx: "flex", sm: "none" }, height: "3%", p: 0 }}>
          <IconButton onClick={() => { setOpenSearch(s => !s); setOpenSearchedUsers(false); }}><SearchOutlined /></IconButton>
          <IconButton onClick={() => { setOpenSearchedUsers(s => !s); setOpenSearch(false); }}><GroupAddOutlined /></IconButton>
        </Box>
        <Box sx={{ display: "flex", height: { xs: "80%", sm: "90%", md: "80%" }, }}>
          {openSearch === true && (
            <Box sx={{ display: { xs: "flex", sm: "none" }, width: "100%" }}>
              <SearchCriteria submit={handleSearchSubmit} change={handleChange} wrongNumber={wrongNumber} criteria={criteria} sizeCheck={isSizeChecked} areaCheck={isAreaChecked} energyCheck={isEnergyChecked} minMax={setMinMaxToZero} incomeCheck={isIncomeChecked} moneyChecked={isMoneyChecked} checkboxOptions={checkboxOptions} havingArea={havingArea} selectedArea={selectedArea} areas={areas} papersChecked={isPapersChecked} otherChecked={isOtherChecked} formError={formError} />
            </Box>
          )}
          <Box sx={{ display: { xs: "none", sm: "flex" }, width: "45%" }}>
            <SearchCriteria submit={handleSearchSubmit} change={handleChange} wrongNumber={wrongNumber} criteria={criteria} sizeCheck={isSizeChecked} areaCheck={isAreaChecked} energyCheck={isEnergyChecked} minMax={setMinMaxToZero} incomeCheck={isIncomeChecked} moneyChecked={isMoneyChecked} checkboxOptions={checkboxOptions} havingArea={havingArea} selectedArea={selectedArea} areas={areas} papersChecked={isPapersChecked} otherChecked={isOtherChecked} formError={formError} />
          </Box>

          {openSearchedUsers === true && (
            <Box sx={{ display: { xs: "flex", sm: "none" }, width: "100%", }}>
              <SearchedUsers visibleUser={visibleUser} nextUser={nextUser} addUser={addUser} />
            </Box>)}

          <Box sx={{ display: { xs: "none", sm: "flex" }, width: "55%", }}>
            <SearchedUsers visibleUser={visibleUser} nextUser={nextUser} addUser={addUser} />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  )
}

export default Match;