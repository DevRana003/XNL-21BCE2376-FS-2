import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/leaderboardService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../utils/socket";

const Leaderboard = () => {
    const { challengeId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetchLeaderboard();

        // Listen for real-time leaderboard updates
        socket.on(`leaderboardUpdate:${challengeId}`, (updatedLeaderboard) => {
            setLeaderboard(updatedLeaderboard);
        });

        return () => {
            socket.off(`leaderboardUpdate:${challengeId}`);
        };
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await getLeaderboard(challengeId);
            setLeaderboard(response.data.data);
        } catch (error) {
            toast.error("Failed to load leaderboard");
        }
    };

    return (
        <div>
            <h1>Leaderboard</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr key={entry.userId._id}>
                            <td>{index + 1}</td>
                            <td>{entry.userId.fullName}</td>
                            <td>{entry.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
