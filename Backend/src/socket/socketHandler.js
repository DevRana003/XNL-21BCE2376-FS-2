import { Server } from "socket.io";
import { Leaderboard } from "../models/leaderboard.model.js";
import { Challenge } from "../models/challenge.model.js";

const onlineUsers = new Map();

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);


        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`${userId} is online`);
        });


        socket.on("sendMessage", ({ senderId, receiverId, message }) => {
            const receiverSocket = onlineUsers.get(receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", { senderId, message });
            }
        });


        socket.on("joinChallenge", async ({ userId, challengeId }) => {
            const challenge = await Challenge.findById(challengeId).populate("participants.userId", "fullName");
            if (challenge) {
                io.emit(`challengeUpdate:${challengeId}`, {
                    message: `${challenge.participants.length} participants in ${challenge.title}`,
                });
            }
        });


        socket.on("updateProgress", async ({ userId, challengeId, progress }) => {
            await Leaderboard.findOneAndUpdate({ userId, challengeId }, { score: progress });


            const leaderboard = await Leaderboard.find({ challengeId })
                .sort({ score: -1 })
                .populate("userId", "fullName avatar");

            io.emit(`leaderboardUpdate:${challengeId}`, leaderboard);
        });


        socket.on("disconnect", () => {
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                }
            });
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
