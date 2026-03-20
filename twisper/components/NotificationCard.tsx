/** @jsxImportSource nativewind */
import React from 'react';
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatters";
import type { Notification } from "@/types";

interface NotificationCardProps {
    notification: Notification;
    onDelete: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onDelete }: NotificationCardProps): React.JSX.Element => {
    const getNotificationText = () => {
        const name = `${notification.from.firstName} ${notification.from.lastName}`;
        switch (notification.type) {
            case "like":
                return `${name} liked your post`;
            case "comment":
                return `${name} commented on your post`;
            case "follow":
                return `${name} started following you`;
            default:
                return "";
        }
    };

    const getNotificationIcon = () => {
        switch (notification.type) {
            case "like":
                return <AntDesign name="heart" size={12} color="#25D366" />;
            case "comment":
                return <Feather name="message-circle" size={12} color="#25D366" />;
            case "follow":
                return <Feather name="user-plus" size={12} color="#25D366" />;
            default:
                return <Feather name="bell" size={12} color="rgba(255, 255, 255, 0.4)" />;
        }
    };

    const handleDelete = () => {
        Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(notification._id),
            },
        ]);
    };

    return (
        <View className="bg-whatsapp-bg mb-px">
            <View className="flex-row p-6">
                <View className="relative mr-4">
                    <Image
                        source={{ uri: notification.from.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                        className="w-14 h-14 rounded-2xl bg-glass-bg border border-glass-border"
                    />
                    <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-whatsapp-bg items-center justify-center border border-glass-border">
                        {getNotificationIcon()}
                    </View>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                            <Text className="text-white text-base leading-5 mb-1 font-Outfit">
                                <Text className="font-black tracking-tight">
                                    {notification.from.firstName} {notification.from.lastName}
                                </Text>
                                <Text className="text-whatsapp-green font-black opacity-80"> @{notification.from.username}</Text>
                            </Text>
                            <Text className="text-white/70 text-[13px] font-bold leading-5 font-Outfit">{getNotificationText()}</Text>
                        </View>

                        <TouchableOpacity className="ml-2 p-2 bg-glass-bg rounded-xl active:bg-white/10 border border-glass-border" onPress={handleDelete}>
                            <Feather name="trash-2" size={16} color="rgba(255, 255, 255, 0.4)" />
                        </TouchableOpacity>
                    </View>

                    {notification.post && (
                        <View className="bg-glass-bg rounded-2xl p-4 mb-3 border border-glass-border">
                            <Text className="text-white/40 text-sm leading-5 font-Outfit" numberOfLines={2}>
                                {notification.post.content}
                            </Text>
                        </View>
                    )}

                    {notification.comment && (
                        <View className="bg-glass-bg rounded-2xl p-4 mb-3 border border-glass-border">
                            <Text className="text-whatsapp-green text-[10px] mb-1 font-black uppercase tracking-widest font-Outfit">Responded</Text>
                            <Text className="text-white/80 text-sm italic font-medium font-Outfit" numberOfLines={2}>
                                &ldquo;{notification.comment.content}&rdquo;
                            </Text>
                        </View>
                    )}

                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest opacity-50 font-Outfit">{formatDate(notification.createdAt)}</Text>
                </View>
            </View>
        </View>
    );
};

export default NotificationCard;
