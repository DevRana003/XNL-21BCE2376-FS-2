import mongoose, { Schema } from "mongoose";

const leaderboardSchema = new Schema(
    {
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge", required: true 
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true 
        },
        score: {
            type: Number,
            default: 0 
        },
    },
    { timestamps: true }
);

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
