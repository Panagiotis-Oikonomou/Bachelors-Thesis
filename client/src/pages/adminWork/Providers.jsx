import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetProvider from "../../hooks/useGetProviders";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import { Box, Container, Paper, Stack, TextField, Typography, Button, IconButton } from "@mui/material";
import { scrollbarStyles } from "../styles/scrollbar";
import { DeleteForever } from "@mui/icons-material";
import MainLayout from "../../components/mainLayout";

function Providers() {
  const axiosPrivate = useAxiosPrivate();
  const getproviders = useGetProvider();
  const [search, setSearch] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [provider, setProvider] = useState('');
  const [providerError, setProviderError] = useState('');

  useEffect(() => {
    setFilteredProviders(getproviders);
  }, [getproviders]);

  async function deleteProvider(providerid) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPrivate.delete(`/admins/providers/${providerid}`);
      setFilteredProviders(prev => prev.filter(p => p.providerid !== providerid));
    }
    catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  function searchProvider(value) {
    setSearch(value);

    if (value === "") setFilteredProviders(getproviders);

    else setFilteredProviders(getproviders.filter(u => u.providername.toLowerCase().includes(value.toLowerCase())));
  }

  async function checkName(value) {
    setProvider(value);
    const providername = value.trim();
    const len = providername.length;
    if (providername === "") {
      setProviderError('');
      return;
    }

    if (providername.length < 2) return;

    try {
      const res = await axiosPrivate.get(`/validate/provider_name/${encodeURIComponent(providername)}`);
      if (res.data.exists) setProviderError('Υπάρχει ήδη αυτός ο πάροχος');

      else setProviderError('');
    }
    catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (provider.length === 0) return;

    if (providerError.trim() === "") {
      try {
        await axiosPrivate.post('/admins/providers', { providername: provider });
        setProvider('');
        try {
          const res = await axios.get('/providers');
          setFilteredProviders(res.data);
        } catch (err) {
          console.error("Error fetching providers:", err);
        }
      }
      catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    document.title = "Providers";
  }, []);

  return (
    <MainLayout mxW="md" paperSx={{ p: { xs: 0.5, sm: 2 }, }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: "flex-start" }} spacing={2}>
          <form>
            <TextField type="search" size="small" value={search} onChange={(e) => searchProvider(e.target.value)} label="Search provider" />
          </form>

          <Box component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex", flexDirection: "column",
              alignItems: { xs: "flex-start", sm: "flex-end", },
              gap: 1,
            }}>
            <TextField label="Όνομα παρόχου" onChange={(e) => checkName(e.target.value)} value={provider}
              helperText={providerError} error={providerError !== ""} sx={{ width: { xs: 181 } }} />
            <Button type="submit" variant="contained" disabled={providerError !== ""}>Πρόσθεσε</Button>
          </Box>
        </Stack>

        <Paper sx={{
          p: { sm: 2 }, width: "100%",
          maxHeight: { sm: "72dvh" }, overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.05)", flexGrow: 1,
          ...scrollbarStyles,
        }} variant="outlined" square={false}
        >
          {filteredProviders.map((item) => {
            return <Paper key={item.providerid} sx={{
              p: 0.5, mb: 1, display: "flex",
              alignItems: "center", ":hover": { bgcolor: "#293440" }
            }}>
              <IconButton onClick={() => deleteProvider(item.providerid)}><DeleteForever /></IconButton>
              <Typography>{item.providername}</Typography>
            </Paper>
          })}
        </Paper>
      </Stack>
    </MainLayout>
  )
}

export default Providers;