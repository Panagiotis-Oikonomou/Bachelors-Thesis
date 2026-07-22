import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { Box, Container, IconButton, Paper, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState({ type: "include", ids: new Set(), });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axiosPrivate.get('/admins/users');
        if (res.data) {
          setUsers(res.data);
          setFilteredUsers(res.data);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, []);

  async function deleteUsers() {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete him!",
      didClose: () => { document.activeElement?.blur(); }
    });

    if (!result.isConfirmed) return;
    const selectedIds = Array.from(selectedRows.ids);

    try {
      if (selectedIds.length > 1) {
        await axiosPrivate.delete("/admins/users", { data: { users: selectedIds } });
        setUsers(prev => prev.filter(u => !selectedIds.includes(u.userid)));
        setFilteredUsers(prev => prev.filter(u => !selectedIds.includes(u.userid)));
      }
      else {
        await axiosPrivate.delete(`/admins/user/${selectedIds[0]}`);
        setUsers(prev => prev.filter(u => u.userid !== selectedIds[0]));
        setFilteredUsers(prev => prev.filter(u => u.userid !== selectedIds[0]));
      }
      setSelectedRows({ type: 'include', ids: new Set(), });
    }
    catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  function searchUser(value) {
    setSearch(value);

    if (value === "") setFilteredUsers(users);

    else setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(value.toLowerCase())));
  }

  const columns = [
    { field: 'username', headerName: 'Username', width: 150, },
    { field: 'fname', headerName: 'Όνομα', width: 150, },
    { field: 'lname', headerName: 'Επώνυμο', width: 150, },
    { field: 'clock', headerName: 'Α.Π.Ρ', width: 120, },
    { field: 'provider', headerName: 'Πάροχος ενέργειας', width: 140, },
    { field: 'email', headerName: 'Email', sortable: false, width: 160, },
  ];

  console.log(selectedRows.ids);
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container maxWidth="lg" sx={{ p: { xs: 0 }, }}>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", }} >
        <Paper sx={{
          p: { xs: 0.5, sm: 1 }, width: "100%",
          height: { sm: "87vh", md: "91vh" }, display: "flex",
          flexDirection: "column", flexGrow: 1,
          border: "1px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.05)",
        }} variant="outlined" square={false}
        >
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box component="form" sx={{ display: "flex", alignItems: "flex-start", gap: 1, }}>
              <TextField type="search" size="small" value={search} onChange={(e) => searchUser(e.target.value)} label="Search user" />
            </Box>
            <IconButton onClick={deleteUsers} disabled={selectedRows.ids.size === 0}><DeleteForever /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0, overflowX: "auto", overflowY: "hidden", }}>
            <DataGrid
              rows={filteredUsers} columns={columns}
              getRowId={(row) => row.userid}
              checkboxSelection
              columnVisibilityModel
              disableRowSelectionExcludeModel
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={(ids) => { setSelectedRows(ids); console.log(ids) }}
              initialState={{ pagination: { paginationModel: paginationModel, }, }}
              pageSizeOptions={[5, 10, 20]} sx={{ width: "98%", height: "100%", }}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Users;