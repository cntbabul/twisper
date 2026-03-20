/** @jsxImportSource nativewind */
import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'
import type { Chat } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { useSocketStore } from '@/lib/socket';
import { Ionicons } from '@expo/vector-icons';

interface ChatItemProps {
    chat: Chat;
    onPress: () => void;
}

const ChatItem = ({ chat, onPress }: ChatItemProps): React.JSX.Element | null => {
    const isOnline = useSocketStore((state) =>
        chat.participant ? state.onlineUsers.has(chat.participant._id) : false
    );
    const isTyping = useSocketStore((state) =>
        chat.participant ? state.typingUsers.get(chat._id) === chat.participant._id : false
    );
    const hasUnread = useSocketStore((state) => state.unreadChats.has(chat._id));

    if (!chat) return null;

    const participant = chat.participant;

    return (
        <Pressable
            onPress={onPress}
            className='flex-row items-center py-5 active:opacity-60'
        >
            {/* Avatar with online indicator */}
            <View className='relative'>
                <Image
                    source={{ uri: participant?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                    style={{ width: 62, height: 62, borderRadius: 24 }}
                    className="bg-glass-bg border border-glass-border"
                />
                {isOnline && (
                    <View
                        className='absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-whatsapp-green rounded-full border-[3px] border-whatsapp-bg'
                    />
                )}
            </View>

            {/* Content */}
            <View className='flex-1 ml-4'>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text
                        className={`text-base font-black flex-1 mr-2 font-Outfit ${hasUnread ? 'text-white' : 'text-white/90'}`}
                        numberOfLines={1}
                    >
                        {participant?.username || 'Unknown'}
                    </Text>
                    <Text className={`text-[10px] font-black uppercase tracking-widest font-Outfit ${hasUnread ? 'text-whatsapp-green' : 'text-white/40'}`}>
                        {chat.lastMessageAt
                            ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false }) : ""}
                    </Text>
                </View>

                <View className='flex-row items-center justify-between'>
                    <View className='flex-1 flex-row items-center gap-1.5'>
                        {isTyping ? (
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="ellipsis-horizontal" size={12} color="#25D366" />
                                <Text className='text-[10px] text-whatsapp-green font-black uppercase tracking-widest font-Outfit'>typing...</Text>
                            </View>
                        ) : (
                            <Text
                                className={`text-[13px] flex-1 font-Outfit ${hasUnread ? 'text-white font-bold' : 'text-white/40'}`}
                                numberOfLines={1}
                            >
                                {chat.lastMessage?.text || "Transmissions available"}
                            </Text>
                        )}
                    </View>
                    {hasUnread && (
                        <View className='w-2 h-2 bg-whatsapp-green rounded-full ml-2 shadow-sm shadow-whatsapp-green/50' />
                    )}
                </View>
            </View>
        </Pressable>
    )
}

export default ChatItem