import api from "./axiosInstance";

export const getProviders = async () => {
    try {
        const res = await api.get('/providers');
        return res.data;
    } catch (err) {
        console.error("Error fetching providers:", err);
        throw err;
    }
}