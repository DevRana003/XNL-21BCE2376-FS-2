import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <h1>Loading...</h1>;

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
