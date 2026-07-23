import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { Box, Container, IconButton, Paper, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import MainLayout from "../../components/mainLayout";
import { scrollbarStyles } from "../styles/scrollbar";

function Users() {
  const axiosPrivate = useAxiosPrivate();
  const [selectedRows, setSelectedRows] = useState({ type: "include", ids: new Set(), });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const paginationModel = { page: 0, pageSize: 5 };

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

  return (
    <MainLayout mxW="lg" paperSx={{ p: { xs: 0.5, sm: 1 }, height: { sm: "87dvh", md: "91dvh" }, display: "flex", flexDirection: "column", flexGrow: 1, }}>
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
          // columnVisibilityModel
          disableRowSelectionExcludeModel
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          initialState={{ pagination: { paginationModel: paginationModel, }, }}
          pageSizeOptions={[5, 10, 20]} sx={{ width: "98%", height: "95%", }}
        />
      </Box>
    </MainLayout>
  )
}

export default Users;