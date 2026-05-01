import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const plainAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const refreshToken = async () => {
    try {
        const res = await plainAxios.post("/refresh", { token: localStorage.getItem("refreshToken") });

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        return res.data;
    } catch (err) {
        console.log(err);
    }
}

api.interceptors.request.use(async (config) => {
    let currentDate = new Date();

    const token = localStorage.getItem("accessToken");

    if (token) {
        const decodeToken = jwtDecode(token);
        if (decodeToken.exp * 1000 < currentDate.getTime()) {
            const data = await refreshToken();
            if (data?.accessToken) {
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }
        }
        else {
            config.headers["authorization"] = "Bearer " + token;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;