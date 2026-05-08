import axios from "./axios";

export const getProviders = async () => {
    try {
        const res = await axios.get('/providers');
        return res.data;
    } catch (err) {
        console.error("Error fetching providers:", err);
        throw err;
    }
}