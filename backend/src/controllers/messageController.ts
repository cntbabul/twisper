import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;

        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        })
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" })
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email avatar")
            .sort({ createdAt: 1 })

        res.json(messages)

    } catch (error) {
        res.status(500)
        next(error)
    }
}