import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideos } from '@/hooks/useVideos';
import ReelItem from '@/components/ReelItem';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EmptyUI from '@/components/EmptyUI';

const { height } = Dimensions.get('window');

const ReelsScreen = () => {
    const { videos, isLoading, refetch } = useVideos();
    const [viewableVideoId, setViewableVideoId] = useState<string | null>(null);
    const router = useRouter();

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setViewableVideoId(viewableItems[0].item._id);
        }
    }).current;

    const renderItem = useCallback(({ item }: { item: any }) => (
        <ReelItem
            video={item}
            isVisible={item._id === viewableVideoId}
        />
    ), [viewableVideoId]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator size="large" color="#25D366" />
                <Text className="text-white mt-4 font-bold uppercase tracking-widest text-xs font-Outfit">Scanning Nodes...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <SafeAreaView className="absolute top-0 left-0 right-0 z-50 p-5 flex-row justify-between items-center">
                <Text className="text-whatsapp-green font-black text-2xl tracking-tighter italic font-Outfit">Reels</Text>
                <TouchableOpacity
                    onPress={() => router.push("/reels/create")}
                    className="bg-glass-bg p-2 rounded-2xl border border-glass-border"
                >
                    <Ionicons name="camera-outline" size={24} color="#25D366" />
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height - 60} // Matches ReelItem height
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                ListEmptyComponent={
                    <View className="flex-1 justify-center py-64">
                        <EmptyUI
                            title="No Reels Found"
                            subtitle="Be the first to share a moment on Nodes Grid."
                            iconName="videocam-outline"
                        />
                    </View>
                }
                onRefresh={refetch}
                refreshing={isLoading}
            />
        </View>
    );
}

export default ReelsScreen;