import type { NextFunction, Response } from "express";
import { Video, VIDEO_DIMENSIONS } from "../models/Video";
import type { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";

export const getVideos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const videos = await Video.find({})
            .sort({ createdAt: -1 })
            .populate("userId", "username avatar firstName lastName");
        
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const createVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        req.setTimeout(10 * 60 * 1000); // 10 minutes timeout for uploads
        const { title, description, transformation } = req.body;
        const userId = req.userId;
        let videoUrl = "";
        let thumbnailUrl = "";

        // If there's a video file, upload it to cloudinary
        if (req.file) {
            console.log("📹 Uploading Video to Cloudinary...", {
                size: req.file.size,
                mimetype: req.file.mimetype
            });
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { 
                        resource_type: "video",
                        folder: "twisper_reels" 
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file!.buffer);
            });
            videoUrl = (result as any).secure_url;
            thumbnailUrl = (result as any).thumbnail_url || (result as any).secure_url.replace(/\.[^/.]+$/, ".jpg");
        }

        if (!videoUrl) {
            return res.status(400).json({ error: "Missing required video data" });
        }

        const videoData = {
            title: title || "New Reel",
            description: description || "",
            videoUrl,
            thumbnailUrl,
            controls: req.body.controls ?? true,
            transformation: {
                height: VIDEO_DIMENSIONS.height,
                width: VIDEO_DIMENSIONS.width,
                quality: transformation?.quality ?? 100
            },
            userId
        };

        const newVideo = await Video.create(videoData);
        await newVideo.populate("userId", "username avatar firstName lastName");
        res.status(201).json(newVideo);
    } catch (error) {
        next(error);
    }
};

export const getVideoById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate("userId", "username avatar firstName lastName");
        
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
};

export const interactVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
        const userId = req.userId;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        if (action === "view") {
            video.views = (video.views || 0) + 1;
            await video.save();
            await video.populate("userId", "username avatar firstName lastName");
            return res.status(200).json(video);
        }

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userIdObj = userId as any; // Cast for comparison

        if (action === "like") {
            const likeIndex = video.likes.indexOf(userIdObj);
            if (likeIndex > -1) {
                video.likes.splice(likeIndex, 1);
            } else {
                video.likes.push(userIdObj);
                const dislikeIndex = video.dislikes.indexOf(userIdObj);
                if (dislikeIndex > -1) {
                    video.dislikes.splice(dislikeIndex, 1);
                }
            }
        } else if (action === "dislike") {
            const dislikeIndex = video.dislikes.indexOf(userIdObj);
            if (dislikeIndex > -1) {
                video.dislikes.splice(dislikeIndex, 1);
            } else {
                video.dislikes.push(userIdObj);
                const likeIndex = video.likes.indexOf(userIdObj);
                if (likeIndex > -1) {
                    video.likes.splice(likeIndex, 1);
                }
            }
        }

        await video.save();
        await video.populate("userId", "username avatar firstName lastName");
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
};
