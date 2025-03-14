import { Challenge } from "../models/challenge.model.js";
import { Leaderboard } from "../models/leaderboard.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { io } from "../index.js";

const createChallenge = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !description || !startDate || !endDate) {
        throw new ApiError(400, "All fields are required");
    }

    const challenge = await Challenge.create({
        title,
        description,
        startDate,
        endDate,
        createdBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, challenge, "Challenge created successfully"));
});


const joinChallenge = asyncHandler(async (req, res) => {
    const { challengeId } = req.body;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        throw new ApiError(404, "Challenge not found");
    }

    const alreadyJoined = challenge.participants.some(p => p.userId.equals(userId));
    if (alreadyJoined) {
        throw new ApiError(400, "You have already joined this challenge");
    }

    challenge.participants.push({ userId });
    await challenge.save();

    await Leaderboard.create({ challengeId, userId, score: 0 });

    // Emit event for real-time leaderboard update
    io.emit("joinChallenge", { userId, challengeId });

    return res.status(200).json(new ApiResponse(200, challenge, "Joined challenge successfully"));
});


const updateProgress = asyncHandler(async (req, res) => {
    const { challengeId, progress } = req.body;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        throw new ApiError(404, "Challenge not found");
    }

    const participant = challenge.participants.find(p => p.userId.equals(userId));
    if (!participant) {
        throw new ApiError(400, "You are not a participant in this challenge");
    }

    participant.progress = progress;
    await challenge.save();

    await Leaderboard.findOneAndUpdate({ challengeId, userId }, { score: progress });

    // Emit WebSocket event to update leaderboard in real-time
    io.emit("updateProgress", { userId, challengeId, progress });

    return res.status(200).json(new ApiResponse(200, {}, "Progress updated successfully"));
});


const getLeaderboard = asyncHandler(async (req, res) => {
    const { challengeId } = req.params;

    const leaderboard = await Leaderboard.find({ challengeId })
        .sort({ score: -1 }) 
        .populate("userId", "fullName avatar");

    return res.status(200).json(new ApiResponse(200, leaderboard, "Leaderboard retrieved"));
});

const getChallenges = asyncHandler(async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ startDate: -1 });
        return res.status(200).json(new ApiResponse(200, challenges, "Challenges retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch challenges");
    }
});

const getChallengeById = asyncHandler(async (req, res) => {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        throw new ApiError(404, "Challenge not found");
    }
    return res.status(200).json(new ApiResponse(200, challenge, "Challenge retrieved successfully"));
});

export { createChallenge, joinChallenge, updateProgress, getLeaderboard , getChallenges , getChallengeById};
