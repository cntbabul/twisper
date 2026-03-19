import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User"


//store online users in memory userId,socketId
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins: string[] = [
        "*",
        process.env.FRONTEND_URL || ""
    ].filter((url) => url !== "");

    const io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"]
        }
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("❌ Socket Authentication Failed: No token provided");
            return next(new Error("Authentication error"))
        }

        try {
            if (!process.env.CLERK_SECRET_KEY) {
                console.warn("⚠️ Warning: CLERK_SECRET_KEY is NOT set in environment!");
            }
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
            const clerkId = session.sub

            const user = await User.findOne({ clerkId });
            if (!user) {
                console.log(`❌ Socket Authentication Failed: User with clerkId ${clerkId} not found in DB`);
                return next(new Error("User not found"))
            }

            socket.data.userId = user._id.toString();
            next();
        } catch (error: any) {
            console.error("❌ Socket Authentication Exception:", error.message || error);
            next(new Error(error))
        }

    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        if (!userId) {
            console.log("No userId found(socket.ts)")
            return;
        }
        // Store user in the onlineUsers map FIRST
        onlineUsers.set(userId, socket.id);

        // Send list of currently online users to the newly connected client (now includes self)
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        // Notify others that this current user is online
        socket.broadcast.emit("user-online", { userId });

        socket.join(`user:${userId}`);
        socket.on("join-chat", (chatId: string) => { socket.join(`chat:${chatId}`) })

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`)
        })
        //handle sending mesage 
        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data;
                const chat = await Chat.findOne({ _id: chatId, participants: userId })
                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not found." })
                    return;
                }
                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text
                })
                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date()
                await chat.save();

                await message.populate("sender", "name avatar");
                // Emit to chat room (for users currently viewing the chat)
                io.to(`chat:${chatId}`).emit("new-message", message);

                // Also emit to participants' personal rooms for those NOT in the chat room
                // (for chat list preview update)
                const chatRoom = io.sockets.adapter.rooms.get(`chat:${chatId}`);
                for (const participantId of chat.participants) {
                    const pId = participantId.toString();
                    if (pId === userId) continue; // Skip sender

                    const participantSocketId = onlineUsers.get(pId);
                    if (participantSocketId && (!chatRoom || !chatRoom.has(participantSocketId))) {
                        io.to(`user:${pId}`).emit("new-message", message);
                    }
                }
            } catch (error) {
                console.log("Error in send-message:", error);
                socket.emit("socket-error", { message: "Failed to send message" })
            }
        })

        socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping
            }
            // emit to chat room (for users inside the chat)
            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);

            try {
                const chat = await Chat.findById(data.chatId);
                if (chat) {
                    const otherParticipantId = chat.participants.find((p: any) => p.toString() !== userId)?.toString();

                    if (otherParticipantId) {
                        const otherSocketId = onlineUsers.get(otherParticipantId);
                        const chatRoom = io.sockets.adapter.rooms.get(`chat:${data.chatId}`);

                        // Only emit to user room if they are NOT in the chat room
                        if (otherSocketId && (!chatRoom || !chatRoom.has(otherSocketId))) {
                            socket.to(`user:${otherParticipantId}`).emit("typing", typingPayload);
                        }
                    }
                }
            } catch (error) {
                //silently fail
            }
        })
        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
            console.log("User disconnected:", userId);
        })


    });

    return io;
};
