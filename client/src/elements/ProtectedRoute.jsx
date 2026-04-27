import React from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from '../helpers/auth';

function ProtectedRoute({ children }) {
    // const token = localStorage.getItem("token");
    // const navigate = useNavigate();
    const user = getUserFromToken();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;