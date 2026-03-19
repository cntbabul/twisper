import type { NextFunction, Response } from "express";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import type { AuthRequest } from "../middleware/auth";

// Get notifications
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        const notifications = await Notification.find({ to: userId })
            .sort({ createdAt: -1 })
            .populate("from", "username firstName lastName avatar")
            .populate("post", "content image")
            .populate("comment", "content");

        res.status(200).json({ notifications });
    } catch (error) {
        next(error);
    }
};

// Delete notification
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndDelete({ _id: notificationId, to: userId });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        next(error);
    }
};
