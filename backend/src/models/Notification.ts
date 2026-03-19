import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    type: "like" | "comment" | "follow";
    post?: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "comment", "follow"],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },

}, { timestamps: true })

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
