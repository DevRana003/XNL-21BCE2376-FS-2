import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/challenges";

export const getLeaderboard = async (challengeId) => {
    return await axios.get(`${API_URL}/leaderboard/${challengeId}`);
};

