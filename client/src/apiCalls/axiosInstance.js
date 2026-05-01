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
    const token = localStorage.getItem("accessToken");

    if (token) {
        try {
            const decodeToken = jwtDecode(token);
            const currentDate = new Date();

            if (decodeToken.exp * 1000 < currentDate.getTime()) {
                const data = await refreshToken();

                if (!data) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");

                    window.location.href = "/login";
                    return config;
                }

                config.headers.authorization = "Bearer " + data.accessToken;
            }
            else {
                config.headers.authorization = "Bearer " + token;
            }
        }
        catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "/login";
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;