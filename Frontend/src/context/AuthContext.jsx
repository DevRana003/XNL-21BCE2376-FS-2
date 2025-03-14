import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);


    const login = async (formData) => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/login", formData);
            const { accessToken, user } = response.data.data;

            localStorage.setItem("token", accessToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
