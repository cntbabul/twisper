/** @jsxImportSource nativewind */
import EmptyUI from "@/components/EmptyUI";
import MessageBubble, { DateSeparator, TypingIndicator } from "@/components/MessageBubble";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useSocketStore } from "@/lib/socket";
import { Message, MessageSender } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    FlatList,
    Platform,
    ActivityIndicator,
    TextInput,
    KeyboardAvoidingView,
    ListRenderItem,
} from "react-native";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { isSameDay } from "date-fns";

type ChatParams = {
    id: string;
    participantId: string;
    name: string;
    avatar: string;
};

type MessageElement = {
    id: string;
    type: "date" | "message";
    date?: string;
    message?: Message;
    isFromMe?: boolean;
    showAvatar?: boolean;
};

const HEADER_HEIGHT = 56;

const ChatDetailScreen = (): React.JSX.Element => {
    const insets = useSafeAreaInsets();
    const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const { data: currentUser } = useCurrentUser();
    const { data: messages, isLoading } = useMessages(chatId);

    const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers } = useSocketStore();

    const isOnline = participantId ? onlineUsers.has(participantId) : false;
    const isTyping = typingUsers.get(chatId) === participantId;

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // join chat room on mount, leave on unmount
    useEffect(() => {
        if (chatId && isConnected) joinChat(chatId);

        return () => {
            if (chatId) leaveChat(chatId);
        };
    }, [chatId, isConnected, joinChat, leaveChat]);

    // scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 150);
        }
    }, [messages]);

    // Group messages with date separators and avatar logic
    const messageElements = useMemo((): MessageElement[] => {
        if (!messages || messages.length === 0) return [];

        const elements: MessageElement[] = [];
        let lastDate: string | null = null;

        messages.forEach((message, index) => {
            const msgDate = new Date(message.createdAt);
            if (!lastDate || !isSameDay(new Date(lastDate), msgDate)) {
                elements.push({ id: `date-${message.createdAt}-${index}`, type: "date", date: message.createdAt });
                lastDate = message.createdAt;
            }

            const senderId = (message.sender as MessageSender)._id;
            const isFromMe = currentUser ? senderId === currentUser._id : false;

            const nextMsg = messages[index + 1];
            const nextSenderId = nextMsg ? (nextMsg.sender as MessageSender)._id : null;
            const showAvatar = !isFromMe && senderId !== nextSenderId;

            elements.push({ id: message._id, type: "message", message, isFromMe, showAvatar });
        });

        return elements;
    }, [messages, currentUser]);

    const handleTyping = useCallback(
        (text: string) => {
            setMessageText(text);

            if (!isConnected || !chatId) return;

            if (text.length > 0) {
                sendTyping(chatId, true);

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = setTimeout(() => {
                    sendTyping(chatId, false);
                }, 2000);
            } else {
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                sendTyping(chatId, false);
            }
        },
        [chatId, isConnected, sendTyping]
    );

    const handleSend = () => {
        if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sendTyping(chatId, false);

        setIsSending(true);
        sendMessage(chatId, messageText.trim(), {
            _id: currentUser._id,
            username: currentUser.username,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatar: currentUser.avatar,
        });
        setMessageText("");
        setIsSending(false);

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 150);
    };

    const renderItem: ListRenderItem<MessageElement> = useCallback(({ item }) => {
        if (item.type === "date" && item.date) {
            return <DateSeparator date={item.date} />;
        }
        if (item.type === "message" && item.message) {
            return (
                <MessageBubble
                    message={item.message}
                    isFromMe={item.isFromMe ?? false}
                    showAvatar={item.showAvatar}
                />
            );
        }
        return null;
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#0d0d0f" }}>
            {/* Status bar spacer */}
            <View style={{ height: insets.top, backgroundColor: "#17171a" }} />

            {/* Header */}
            <View
                style={{ height: HEADER_HEIGHT, backgroundColor: "#17171a", borderBottomWidth: 0.5, borderBottomColor: "rgba(42,42,46,0.5)" }}
                className="flex-row items-center px-4"
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-9 h-9 rounded-full items-center justify-center active:bg-surface-card"
                >
                    <Ionicons name="chevron-back" size={24} color="#F4A261" />
                </Pressable>

                <Pressable className="flex-row items-center flex-1 ml-1 active:opacity-80">
                    <View className="relative">
                        {avatar && (
                            <Image
                                source={avatar}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                        )}
                        {isOnline && (
                            <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                        )}
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
                            {name}
                        </Text>
                        <Text className={`text-xs ${isTyping ? "text-primary" : isOnline ? "text-green-500" : "text-muted-foreground"}`}>
                            {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                        </Text>
                    </View>
                </Pressable>

                <View className="flex-row items-center gap-1">
                    <Pressable className="w-9 h-9 rounded-full items-center justify-center active:bg-surface-card">
                        <Ionicons name="call-outline" size={20} color="#A0A0A5" />
                    </Pressable>
                    <Pressable className="w-9 h-9 rounded-full items-center justify-center active:bg-surface-card">
                        <Ionicons name="videocam-outline" size={20} color="#A0A0A5" />
                    </Pressable>
                </View>
            </View>

            {/* Content area — KeyboardAvoidingView wraps messages + input */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + HEADER_HEIGHT : 0}
            >
                {/* Messages */}
                <View style={{ flex: 1 }}>
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#F4A261" />
                        </View>
                    ) : !messages || messages.length === 0 ? (
                        <EmptyUI
                            title="No messages yet"
                            subtitle="Start the conversation!"
                            iconName="chatbubbles-outline"
                            iconColor="#6B6B70"
                            iconSize={64}
                        />
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messageElements}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 6 }}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled"
                            onContentSizeChange={() => {
                                flatListRef.current?.scrollToEnd({ animated: false });
                            }}
                            ListFooterComponent={isTyping ? <TypingIndicator avatar={avatar} /> : null}
                        />
                    )}
                </View>

                {/* Input bar */}
                <View
                    style={{
                        paddingHorizontal: 12,
                        paddingTop: 8,
                        paddingBottom: Math.max(insets.bottom, 8),
                        backgroundColor: "#17171a",
                        borderTopWidth: 0.5,
                        borderTopColor: "rgba(42,42,46,0.3)",
                    }}
                >
                    <View className="flex-row items-end bg-surface-card rounded-3xl px-2 py-1 gap-1">
                        <Pressable className="w-9 h-9 rounded-full items-center justify-center active:bg-surface-light/20">
                            <Ionicons name="add" size={22} color="#F4A261" />
                        </Pressable>

                        <TextInput
                            placeholder="Message..."
                            placeholderTextColor="#6B6B70"
                            className="flex-1 text-foreground text-[15px] py-2 px-1"
                            multiline
                            style={{ maxHeight: 100 }}
                            value={messageText}
                            onChangeText={handleTyping}
                            onSubmitEditing={handleSend}
                            editable={!isSending}
                            selectionColor="#F4A261"
                        />

                        <Pressable
                            className={`w-9 h-9 rounded-full items-center justify-center mb-0.5 ${messageText.trim() ? "bg-primary" : "bg-surface-light/30"
                                }`}
                            onPress={handleSend}
                            disabled={!messageText.trim() || isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator size="small" color="#0D0D0F" />
                            ) : (
                                <Ionicons
                                    name="send"
                                    size={16}
                                    color={messageText.trim() ? "#0D0D0F" : "#6B6B70"}
                                />
                            )}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatDetailScreen;