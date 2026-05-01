import { jwtDecode } from "jwt-decode";
import api from "../apiCalls/axiosInstance";

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return false;

    try {
        const res = await api.post("/refresh", {
            token: refreshToken,
        });

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        return true;
    } catch {
        return false;
    }
};