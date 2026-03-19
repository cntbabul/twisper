import mongoose, { Schema, type Document } from 'mongoose';

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;

export interface IVideo extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    };
    views: number;
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}

const VideoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100, default: 100 },
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, {
    timestamps: true,
});

export const Video = mongoose.model<IVideo>('Video', VideoSchema);
