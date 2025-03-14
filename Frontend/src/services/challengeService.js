import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/challenges";

export const getChallenges = async () => {
    return await axios.get(`${API_URL}`);
};

export const joinChallenge = async (challengeId) => {
    return await axios.post(`${API_URL}/join`, { challengeId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
};

export const updateProgress = async (challengeId, progress) => {
    return await axios.patch(`${API_URL}/update-progress`, { challengeId, progress }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
};

