import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !message) {
        throw new ApiError(400, "Receiver ID and message are required");
    }

    const chatMessage = await Chat.create({ senderId, receiverId, message });

    return res.status(201).json(new ApiResponse(201, chatMessage, "Message sent successfully"));
});

const getChatHistory = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId) {
        throw new ApiError(400, "Receiver ID is required");
    }

    const messages = await Chat.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, messages, "Chat history retrieved"));
});

export { sendMessage, getChatHistory };
