import { Navigate } from "react-router-dom";
import { getUserFromToken } from '../helpers/auth';
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    // const token = localStorage.getItem("token");
    // const navigate = useNavigate();
    const user = getUserFromToken();
    const {token} = useAuth();

    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }
    if(!token) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute;