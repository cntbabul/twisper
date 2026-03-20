/** @jsxImportSource nativewind */
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import NotificationCard from '@/components/NotificationCard';
import NoNotificationsFound from '@/components/NoNotificationsFound';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = (): React.JSX.Element => {
    const { notifications, isLoading, error, refetch, deleteNotification } = useNotifications();

    if (error) {
        return (
            <View className="flex-1 items-center justify-center p-8 bg-background">
                <Text className="text-accent mb-4 text-center font-bold">Failed to load notifications</Text>
                <TouchableOpacity className="bg-surface-light px-8 py-3 rounded-2xl border border-white/10" onPress={() => refetch()}>
                    <Text className="text-white font-black uppercase tracking-widest text-xs">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-whatsapp-bg">
            <Header title="Alerts" subtitle="Neural Nodes" />

            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5">
                <Text className="text-white/40 font-black uppercase tracking-widest text-[10px] font-Outfit">Transmission Log</Text>
                <TouchableOpacity hitSlop={15}>
                    <Ionicons name="settings-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center p-8">
                    <ActivityIndicator size="large" color="#25D366" />
                    <Text className="text-whatsapp-green font-black uppercase tracking-[0.2em] text-[10px] mt-4 font-Outfit">Syncing Nodes...</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <NotificationCard
                            notification={item}
                            onDelete={deleteNotification}
                        />
                    )}
                    ListEmptyComponent={<NoNotificationsFound />}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                            tintColor="#25D366"
                            colors={["#25D366"]}
                            progressBackgroundColor="#0B141A"
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default NotificationsScreen;
