import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequiredAuth = ({ admin }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth?.accessToken) return <Navigate to="/login" state={{ from: location }} replace />;

    if (admin && !auth?.isAdmin) {
        // if trying to access an admin route but the user is not an admin
        return <Navigate to="/profile" replace />;
    }

    if(!admin && auth?.isAdmin) return <Navigate to="/profile/admin" replace />;

    return <Outlet />;
}

export default RequiredAuth;