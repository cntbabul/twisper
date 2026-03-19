import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    bannerImage?: string;
    bio?: string;
    location?: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    bannerImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    bio: {
        type: String,
        default: '',
        maxLength: 160,
    },
    location: {
        type: String,
        default: '',
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

}, { timestamps: true })

export const User = mongoose.model<IUser>("User", userSchema);
