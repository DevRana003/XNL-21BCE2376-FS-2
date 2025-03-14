import { useEffect, useState } from "react";
import { getChallenges, joinChallenge } from "../services/challengeService";
import { toast } from "react-toastify";

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const response = await getChallenges();
            setChallenges(response.data.data);
        } catch (error) {
            toast.error("Failed to load challenges");
        }
    };

    const handleJoinChallenge = async (challengeId) => {
        try {
            await joinChallenge(challengeId);
            toast.success("Joined challenge!");
            fetchChallenges();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to join challenge");
        }
    };

    return (
        <div>
            <h1>Challenges</h1>
            <ul>
                {challenges.map((challenge) => (
                    <li key={challenge._id}>
                        <h3>{challenge.title}</h3>
                        <p>{challenge.description}</p>
                        <p>Start: {new Date(challenge.startDate).toDateString()}</p>
                        <p>End: {new Date(challenge.endDate).toDateString()}</p>
                        <button onClick={() => handleJoinChallenge(challenge._id)}>Join Challenge</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Challenges;
