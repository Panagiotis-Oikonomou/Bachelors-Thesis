import axios from "axios";

export const getProviders = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/providers');
        return res.data;
    } catch (err) {
        console.error("Error fetching providers:", err);
        throw err;
    }
}