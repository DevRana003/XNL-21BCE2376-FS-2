import { Server } from "socket.io";

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
