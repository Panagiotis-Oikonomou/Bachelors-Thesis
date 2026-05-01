import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isTokenExpired, tryRefreshToken } from "../utils/auth";

const ProtectedRoute = () => {
    const location = useLocation();
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setIsAuth(false);
                return;
            }

            if (!isTokenExpired(token)) {
                setIsAuth(true);
                return;
            }

            const refreshed = await tryRefreshToken();

            setIsAuth(refreshed);
        };

        checkAuth();
    }, []);

    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;