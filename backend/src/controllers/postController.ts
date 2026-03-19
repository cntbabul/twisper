import type { NextFunction, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Comment } from "../models/Comment";
import { Notification } from "../models/Notification";
import type { AuthRequest } from "../middleware/auth";

import { ImageKit } from "@imagekit/nodejs";
import imagekit from "../config/imagekit";

// Create Post
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        req.setTimeout(10 * 60 * 1000); // 10 minutes timeout for uploads
        const { content } = req.body;
        const userId = req.userId;
        let imageUrl = "";

        // If there's an image file, upload it to imagekit
        if (req.file) {
            console.log("📤 Uploading to ImageKit...", {
                filename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            });
            
            const fileToUpload = await ImageKit.toFile(req.file.buffer, req.file.originalname);
            const result = await imagekit.files.upload({
                file: fileToUpload,
                fileName: `post_${Date.now()}_${req.file.originalname}`,
                folder: "/twisper_posts"
            });
            
            imageUrl = result.url;
        }

        if (!content && !imageUrl) {
            return res.status(400).json({ message: "Post must have text or image" });
        }

        const post = await Post.create({
            user: userId,
            content: content || "",
            image: imageUrl,
        });

        res.status(201).json({ post });
    } catch (error) {
        next(error);
    }
};

// Get All Posts
export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find()
            .populate("user", "username firstName lastName avatar")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName avatar"
                }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Get Single Post
export const getPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate("user", "username firstName lastName avatar")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName avatar"
                },
            });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ post });
    } catch (error) {
        next(error);
    }
};

// Get User Posts
export const getUserPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ user: user._id })
            .populate("user", "username firstName lastName avatar")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName avatar"
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Like Post
export const likePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userIdStr = userId as string;
        const isLiked = post.likes.some(id => id.toString() === userIdStr);

        if (isLiked) {
            // unlike
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userIdStr as any } });
        } else {
            // like
            await Post.findByIdAndUpdate(postId, { $push: { likes: userIdStr as any } });

            // create notification if not liking own post
            if (post.user.toString() !== userIdStr) {
                await Notification.create({
                    from: userIdStr,
                    to: post.user,
                    type: "like",
                    post: postId as any,
                });
            }
        }
        res.status(200).json({ message: isLiked ? "Post unliked successfully" : "Post liked successfully" });
    } catch (error) {
        next(error);
    }
};

// Delete Post
export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.user.toString() !== userId) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }

        // delete all comments on this post
        await Comment.deleteMany({ post: postId });

        // delete the post
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};
