import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoNotificationsFound = () => {
    return (
        <View className="flex-1 items-center justify-center p-12 mt-16">
            <View className="w-24 h-24 bg-glass-bg rounded-3xl items-center justify-center mb-6 border border-glass-border">
                <Ionicons name="notifications-off-outline" size={44} color="#25D366" />
            </View>
            <Text className="text-white text-2xl font-black mb-3 tracking-tighter font-Outfit">NODE SILENCE</Text>
            <Text className="text-white/40 text-center font-bold px-6 leading-5 italic font-Outfit">
                No active transmissions detected. Your neural interface will light up when the grid responds to your presence.
            </Text>
        </View>
    );
};

export default NoNotificationsFound;
