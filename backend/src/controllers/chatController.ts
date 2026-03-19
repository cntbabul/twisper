import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Response } from "express";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const chats = await Chat.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 })

        const formattedChats = chats.map((chat: any) => {
            const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
            return {
                _id: chat._id,
                participant: otherParticipant || null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            }
        });
        res.json(formattedChats)
    } catch (error) {
        res.status(500)
        next(error)
    }

}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { participantId } = req.params;
        if (!participantId || typeof participantId !== "string") {
            return res.status(400).json({ error: "participantId must be a valid string" });
        }
        if (!Types.ObjectId.isValid(participantId)) {
            return res.status(400).json({ error: "Invalid participantId" });
        }

        //check if chat exists
        let chat = await Chat.findOne({ participants: { $all: [userId, participantId] }, })
            .populate("participants", "name email avatar")
            .populate("lastMessage");
        if (!chat) {
            const newChat = new Chat({
                participants: [userId, participantId],
            })
            await newChat.save();
            chat = await newChat.populate("participants", "name email avatar");
        }
        const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        })

    } catch (error) {
        res.status(500)
        next(error)
    }

}
