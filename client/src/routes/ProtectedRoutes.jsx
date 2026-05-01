// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const isTokenValid = (token) => {
//     if (!token) return false;

//     try {
//         const decoded = jwtDecode(token);
//         return decoded.exp * 1000 > Date.now();
//     } catch {
//         return false;
//     }
// };

// const ProtectedRoute = () => {
//     const location = useLocation();
//     const token = localStorage.getItem("accessToken");

//     if (!isTokenValid(token)) {
//         localStorage.clear();
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     return <Outlet />;
// };

// export default ProtectedRoute;

// src/routes/ProtectedRoutes.jsx
// src/routes/ProtectedRoutes.jsx
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