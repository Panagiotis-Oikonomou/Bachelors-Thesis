import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {jwtDecode} from 'jwt-decode';

const RequiredAuth = ({ admin }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth?.accessToken) return <Navigate to="/login" state={{ from: location }} replace />;
    const decoded = jwtDecode(auth.accessToken);
    
    if (admin && !decoded?.isAdmin) {
        // if trying to access an admin route but the user is not an admin
        return <Navigate to="/profile" replace />;
    }

    if(!admin && decoded?.isAdmin) return <Navigate to="/profile/admin" replace />;

    return <Outlet />;
}

export default RequiredAuth;