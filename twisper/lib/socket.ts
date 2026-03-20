import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender } from "@/types";

import { Platform } from "react-native";

import Constants from "expo-constants";

// Initial URL setup will be handled inside the store to be reactive to Constants
const getSocketUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '');
    }
    if (Platform.OS === 'android') {
        const debuggerHost = Constants.expoConfig?.hostUri;
        if (debuggerHost) {
            return `http://${debuggerHost.split(':')[0]}:3000`;
        }
        return "http://10.0.2.2:3000";
    }
    return "http://localhost:3000";
};

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    isConnecting: boolean;
    onlineUsers: Set<string>;
    typingUsers: Map<string, string>;
    unreadChats: Set<string>;
    currentChatId: string | null;
    queryClient: QueryClient | null;
    lastToken: string | null;

    connect: (token: string, queryClient: QueryClient) => void;
    disconnect: () => void;
    joinChat: (chatId: string) => void;
    leaveChat: (chatId: string) => void;
    sendMessage: (chatId: string, text: string, currentUser: MessageSender) => void;
    sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    isConnecting: false,
    onlineUsers: new Set(),
    typingUsers: new Map(),
    unreadChats: new Set(),
    currentChatId: null,
    queryClient: null,
    lastToken: null,

    connect: (token: string, queryClient: QueryClient) => {
        const { socket: existingSocket, isConnecting, lastToken } = get();

        // If already connected/connecting with the same token, do nothing
        if ((existingSocket?.connected || isConnecting) && lastToken === token) return;

        if (existingSocket) {
            existingSocket.disconnect();
        }

        const url = getSocketUrl();
        console.log("🔌 Connecting to socket:", url);

        set({ isConnecting: true, lastToken: token });
        const socket = io(url, {
            auth: { token },
            transports: ['websocket', 'polling'], // Allow polling if websocket fails
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            timeout: 15000
        });

        socket.on("connect", () => {
            console.log("🟢 Socket connected", { socketId: socket.id });
            const { currentChatId } = get();
            if (currentChatId) {
                console.log("🏠 Automatically re-joining chat:", currentChatId);
                socket.emit("join-chat", currentChatId);
            }
            set({ isConnected: true, isConnecting: false, socket });
        });

        socket.on("connect_error", (error: any) => {
            console.error("🔴 Socket connect_error:", { message: error.message });
            set({ isConnected: false, isConnecting: false });
        });

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected", socket.id);
            set({ isConnected: false, socket: null });
        });

        socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
            console.log("🟢 Received Online users:", userIds);
            set({ onlineUsers: new Set(userIds) });
        });

        socket.on("user-online", ({ userId }: { userId: string }) => {
            console.log("🟢 User online:", userId);
            set((state) => ({ onlineUsers: new Set(Array.from(state.onlineUsers).concat(userId)) }));
        });

        socket.on("user-offline", ({ userId }: { userId: string }) => {
            console.log("🔴 User offline:", userId);
            set((state) => {
                const onlineUsers = new Set(state.onlineUsers);
                onlineUsers.delete(userId);
                return { onlineUsers };
            });
        });

        socket.on("new-message", (message: Message) => {
            const senderId = (message.sender as MessageSender)._id;
            const { currentChatId } = get();
            queryClient.setQueryData<Message[]>(['messages', message.chat], (old) => {
                if (!old) return [message];

                // 1. Deduplicate by real ID (in case of double emission)
                let filtered = old.filter((msg) => msg._id !== message._id);

                // 2. If this is our own message coming back, remove the earliest optimistic message
                const currentUser = queryClient.getQueryData<any>(['currentUser']);
                if (senderId === currentUser?._id) {
                    const tempIndex = filtered.findIndex(msg => msg._id.startsWith("temp-"));
                    if (tempIndex > -1) {
                        filtered = [...filtered.slice(0, tempIndex), ...filtered.slice(tempIndex + 1)];
                    }
                }

                return [...filtered, message];
            });
            //update chat list
            queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
                return oldChats?.map((chat) => {
                    if (chat._id === message.chat) {
                        return {
                            ...chat,
                            lastMessage: {
                                _id: message._id,
                                text: message.text,
                                sender: senderId,
                                createdAt: message.createdAt,
                            },
                            lastMessageAt: message.createdAt,
                        }
                    }
                    return chat;
                })
            })
            //mark chat as unread if not current chat
            if (currentChatId !== message.chat) {
                const chats = queryClient.getQueryData<Chat[]>(['chats'])
                const chat = chats?.find((c) => c._id === message.chat)
                if (chat?.participant && senderId === chat.participant._id) {
                    set((state) => ({
                        unreadChats: new Set([...state.unreadChats, message.chat]),
                    }));
                }
            }

        });

        socket.on("typing", ({ chatId, userId, isTyping }: { chatId: string, userId: string, isTyping: boolean }) => {
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                if (isTyping) typingUsers.set(chatId, userId);
                else typingUsers.delete(chatId);
                return { typingUsers };
            })

        });

        socket.on("socket-error", (error: { message: string }) => {
            console.log("🔴 Socket error:", error.message);
            // Don't disconnect — socket-error is a message-level error, not a connection-level one
        });

        set({ queryClient });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ isConnected: false, socket: null });
        }
    },

    joinChat: (chatId: string) => {
        const socket = get().socket;
        set((state) => {
            const unreadChats = new Set(state.unreadChats);
            unreadChats.delete(chatId);
            return { currentChatId: chatId, unreadChats: unreadChats };
        })
        if (socket?.connected) {
            socket.emit("join-chat", chatId);
        }
    },

    leaveChat: (chatId: string) => {
        const { socket, isConnected } = get();
        set({ currentChatId: null });
        if (isConnected && socket) {
            socket.emit("leave-chat", chatId);
        }
    },

    sendMessage: (chatId: string, text: string, currentUser: MessageSender) => {
        const { socket, queryClient } = get();
        if (!socket?.connected || !queryClient) return

        //optimistic message update
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            _id: tempId,
            chat: chatId,
            sender: currentUser,
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        //add optimistic message immediately
        queryClient.setQueryData<Message[]>(['messages', chatId], (old) => {
            if (!old) return [optimisticMessage];
            return [...old, optimisticMessage];
        })
        socket.emit("send-message", { chatId, text });

        const errorHandler = (error: { message: string }) => {
            console.log("🔴 Socket error:", error.message);
            queryClient.setQueryData<Message[]>(['messages', chatId], (old) => {
                if (!old) return [];
                return old.filter((msg) => msg._id !== tempId);
            });
            socket.off("socket-error", errorHandler);
        }
        socket.once("socket-error", errorHandler)

    },

    sendTyping: (chatId: string, isTyping: boolean) => {
        const { socket, isConnected } = get();
        if (isConnected && socket) {
            socket.emit("typing", {
                chatId,
                isTyping,
            });
        }
    },
}));