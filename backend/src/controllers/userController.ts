import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import type { AuthRequest } from "../middleware/auth";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const users = await User.find({ _id: { $ne: userId } })
            .select("firstName lastName username email avatar")
            .limit(50)

        res.json(users)

    } catch (error) {
        res.status(500)
        next(error)
    }
}

export async function getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export async function followUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { targetUserId } = req.params;

        if (userId === targetUserId) {
            res.status(400).json({ error: "You cannot follow yourself" });
            return;
        }

        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isFollowing = currentUser.following.some(id => id.toString() === targetUserId);

        if (isFollowing) {
            // unfollow
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUserId as any } });
            await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUser._id as any } });
        } else {
            // follow
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: targetUserId as any } });
            await User.findByIdAndUpdate(targetUser._id, { $push: { followers: currentUser._id as any } });

            // create notification
            await Notification.create({
                from: currentUser._id,
                to: targetUser._id,
                type: "follow",
            });
        }

        res.status(200).json({ message: isFollowing ? "User unfollowed successfully" : "User followed successfully" });
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { firstName, lastName, bio, location } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, bio, location },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}