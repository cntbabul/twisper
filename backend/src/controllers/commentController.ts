import type { NextFunction, Response } from "express";
import mongoose from "mongoose";
import { Comment } from "../models/Comment";
import { Notification } from "../models/Notification";
import { Post } from "../models/Post";
import { User } from "../models/User";
import type { AuthRequest } from "../middleware/auth";

// Get Comments
export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        if (typeof postId !== "string" || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate("user", "username firstName lastName avatar");

        res.status(200).json({ comments });
    } catch (error) {
        next(error);
    }
};

// Create Comment
export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;
        const { content } = req.body;

        if (typeof postId !== "string" || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = await Comment.create({
            user: userId,
            post: postId,
            content,
        });

        // link the comment to the post
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id as any } });

        // create notification if not commenting on own post
        if (post.user.toString() !== userId) {
            await Notification.create({
                from: userId,
                to: post.user,
                type: "comment",
                post: postId,
                comment: comment._id,
            });
        }

        res.status(201).json({ comment });
    } catch (error) {
        next(error);
    }
};

// Delete Comment
export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { commentId } = req.params;

        if (typeof commentId !== "string" || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        // remove comment from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: commentId as any },
        });

        // delete the comment
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        next(error);
    }
};
