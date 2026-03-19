import mongoose, { Schema, type Document } from "mongoose";

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 280,
    },
    image: {
        type: String,
        default: "",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],

}, { timestamps: true })

export const Post = mongoose.model<IPost>("Post", postSchema);
