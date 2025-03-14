import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
    {
        title:{
            type: String,
            required: true 
        },
        description:{
            type: String,
            required: true 
        },
        startDate:{
            type: Date,
            required:true 
        },
        endDate:{
            type: Date,
            required: true 
        },
        participants: [
            {
                userId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User" 
                },
                progress:
                {
                    type: Number,
                    default: 0 
                }
            }
        ],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Challenge = mongoose.model("Challenge", challengeSchema);

