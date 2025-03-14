import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/users"; // Adjust if needed

export const registerUser = async (userData) => {
    const formData = new FormData();
    
    for (const key in userData) {
        formData.append(key, userData[key]);
    }

    return await axios.post(`${API_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};
