export interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    bannerImage?: string;
    bio?: string;
    location?: string;
    followers?: string[];
    following?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface MessageSender {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface Message {
    _id: string;
    chat: string;
    sender: MessageSender | string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatLastMessage {
    _id: string;
    text: string;
    sender: string;
    createdAt: string;
}

export interface Chat {
    _id: string;
    participant: MessageSender;
    lastMessage: ChatLastMessage | null;
    lastMessageAt: string;
    createdAt: string;
}

export interface Comment {
    _id: string;
    post: string;
    user: MessageSender;
    content: string;
    likes: string[];
    createdAt: string;
}

export interface Post {
    _id: string;
    user: MessageSender;
    content: string;
    image?: string;
    likes: string[];
    comments: Comment[] | string[];
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    _id: string;
    from: MessageSender;
    to: string;
    type: "like" | "comment" | "follow";
    post?: {
        _id: string;
        content: string;
        image?: string;
    };
    comment?: {
        _id: string;
        content: string;
    };
    createdAt: string;
}

export interface Video {
    _id: string;
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
    likes: string[];
    dislikes: string[];
    userId: MessageSender;
    createdAt: string;
    updatedAt: string;
}