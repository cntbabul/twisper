import mongoose, { Schema, type Document } from "mongoose";

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    content: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 280,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
}, { timestamps: true })

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
