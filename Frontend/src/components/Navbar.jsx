import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: "10px", display: "flex", gap: "10px" }}>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/challenges">Challenges</Link>

            {user ? (
                <>
                    <img src={user.avatar} alt="User Avatar" style={{ width: "30px", borderRadius: "50%" }} />
                    <span>{user.fullName}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
