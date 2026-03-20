/** @jsxImportSource nativewind */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { User } from '@/types';
import { useSocketStore } from '@/lib/socket';

interface UserItemProps {
    user: User;
    onPress: () => void;
    disabled?: boolean;
}

const UserItem = ({ user, onPress, disabled }: UserItemProps): React.JSX.Element => {
    const isOnline = useSocketStore((state) => state.onlineUsers.has(user._id));
    return (
        <View>
            <TouchableOpacity
                className="py-3 flex-row items-center"
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <View className="relative">
                    <View className="w-12 h-12 rounded-full bg-glass-bg overflow-hidden items-center justify-center border border-glass-border">
                        {user.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        ) : (
                            <Text className="text-whatsapp-green font-bold text-lg font-Outfit">
                                {user.username?.[0]?.toUpperCase() || '?'}
                            </Text>
                        )}
                    </View>

                    {/* Status Indicator */}
                    {isOnline && (
                        <View
                            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-whatsapp-green border-2 border-whatsapp-bg"
                        />
                    )}
                </View>

                <View className="ml-4 flex-1">
                    <Text className="text-white text-base font-semibold font-Outfit" numberOfLines={1}>
                        {user.username}
                    </Text>
                    <Text className="text-white/40 text-xs font-Outfit" numberOfLines={1}>
                        {user.email}
                    </Text>
                </View>
                <Text className="text-xs text-whatsapp-green font-Outfit">{isOnline ? 'Online' : 'Offline'}</Text>
            </TouchableOpacity>
            <View className="h-px bg-white/5 ml-16" />
        </View>
    );
};

export default UserItem;