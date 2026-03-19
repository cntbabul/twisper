import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId | null;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date | null;
}

const chatSchema = new Schema<IChat>({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

export const Chat = mongoose.model<IChat>("Chat", chatSchema);