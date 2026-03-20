import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from '@/types';
import { useAuth } from '@clerk/expo';
import { useVideos } from '@/hooks/useVideos';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ReelItemProps {
    video: Video;
    isVisible: boolean;
}

const ReelItem = ({ video, isVisible }: ReelItemProps) => {
    const { userId: clerkId } = useAuth();
    const { interactVideo } = useVideos();
    const isFocused = useIsFocused();
    const [isLiked, setIsLiked] = useState(clerkId ? video.likes.includes(clerkId) : false);
    const [likesCount, setLikesCount] = useState(video.likes.length);
    const [isMuted, setIsMuted] = useState(false);
    const [showMuteIcon, setShowMuteIcon] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const player = useVideoPlayer(video.videoUrl, (player) => {
        player.loop = true;
        player.muted = isMuted;
        if (isVisible && isFocused) {
            player.play();
        } else {
            player.pause();
        }
    });

    useEffect(() => {
        if (isVisible && isFocused) {
            player.play();
            // Optional: Register a view
            interactVideo({ id: video._id, action: 'view' });
        } else {
            player.pause();
        }
    }, [isVisible, isFocused, player, interactVideo, video._id]);

    useEffect(() => {
        player.muted = isMuted;
    }, [isMuted, player]);

    const handleToggleMute = () => {
        setIsMuted(prev => !prev);
        setShowMuteIcon(true);
        setTimeout(() => setShowMuteIcon(false), 800);
    };

    const handleLike = () => {
        if (!clerkId) return;
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        interactVideo({ id: video._id, action: 'like' });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handleToggleMute} style={StyleSheet.absoluteFill}>
                <VideoView
                    player={player}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    nativeControls={false}
                />
            </Pressable>
            {/* Mute/Unmute Visual Indicator Overlay */}
            {showMuteIcon && (
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="absolute top-1/2 left-1/2 -ml-12 -mt-12 bg-black/40 p-6 rounded-full items-center justify-center pointer-events-none"
                    style={{ zIndex: 100 }}
                >
                    <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={48}
                        color="#25D366"
                    />
                </Animated.View>
            )}

            {/* Bottom Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(11, 20, 26, 0.85)', 'rgba(11, 20, 26, 0.98)']}
                className="absolute bottom-0 left-0 right-0 justify-end px-5 pb-32 pt-16"
            >
                <View className="flex-row items-end justify-between">
                    <View className="flex-1 mr-4">
                        {/* User Header Row */}
                        <View className="flex-row items-center mb-4">
                            {/* Avatar */}
                            <View>
                                <View className="rounded-full p-[2px] bg-whatsapp-green/40 shadow-xl shadow-whatsapp-green/20">
                                    <View className="rounded-full overflow-hidden border-2 border-whatsapp-bg">
                                        <Image
                                            source={video.userId?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
                                            style={{ width: 48, height: 48 }}
                                            contentFit="cover"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="ml-3 flex-row items-center">
                                {/* Username */}
                                <Text className="text-white font-black text-lg mr-4 font-Outfit shadow-md shadow-black">
                                    {video.userId?.username || "Anonymous Node"}
                                </Text>

                                {/* Follow Button */}
                                <TouchableOpacity 
                                    onPress={() => setIsFollowing(!isFollowing)}
                                    className={`px-5 py-2.5 rounded-full border-2 ${isFollowing ? 'border-white/30 bg-white/10' : 'border-whatsapp-green bg-whatsapp-green/20'} items-center justify-center`}
                                >
                                    <Text className={`font-black text-[11px] font-Outfit uppercase tracking-[1.5px] ${isFollowing ? 'text-white/60' : 'text-whatsapp-green'}`}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Title & Description with "See more" */}
                        <View className="ml-1">
                            {!isExpanded ? (
                                <TouchableOpacity onPress={() => setIsExpanded(true)}>
                                    <Text className="text-white font-black text-base font-Outfit shadow-md shadow-black mb-1" numberOfLines={1}>
                                        {video.title}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-white/70 font-bold text-sm font-Outfit shadow-md shadow-black">
                                            See more context
                                        </Text>
                                        <Ionicons name="chevron-down" size={14} color="rgba(255, 255, 255, 0.5)" style={{ marginLeft: 6 }} />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Animated.View entering={FadeIn}>
                                    <View className="bg-black/20 p-3 rounded-2xl glass-2 border border-white/10">
                                        <TouchableOpacity onPress={() => setIsExpanded(false)}>
                                            <Text className="text-whatsapp-green font-black text-lg mb-2 font-Outfit tracking-tight shadow-md shadow-black">
                                                {video.title}
                                            </Text>
                                            {video.description && (
                                                <Text className="text-white text-[15px] font-medium font-Outfit leading-6 shadow-md shadow-black mb-3">
                                                    {video.description}
                                                </Text>
                                            )}
                                            <View className="flex-row items-center border-t border-white/10 pt-2">
                                                <Text className="text-white/60 font-bold text-xs font-Outfit uppercase tracking-widest">
                                                    Collapse Details
                                                </Text>
                                                <Ionicons name="chevron-up" size={14} color="rgba(255, 255, 255, 0.4)" style={{ marginLeft: 6 }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            )}
                        </View>
                    </View>

                    {/* Action Sidebar */}
                    <View className="items-center gap-6 pb-2">
                        <TouchableOpacity onPress={handleLike} className="items-center">
                            <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/20 glass-2">
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={30}
                                    color={isLiked ? "#25D366" : "white"}
                                />
                            </View>
                            <Text className="text-white text-[11px] font-black mt-2 font-Outfit uppercase tracking-widest shadow-sm shadow-black">{likesCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/20 glass-2">
                                <Ionicons name="chatbubble-outline" size={28} color="white" />
                            </View>
                            <Text className="text-white text-[11px] font-black mt-2 font-Outfit uppercase tracking-widest shadow-sm shadow-black">0</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/20 glass-2">
                                <Ionicons name="share-social-outline" size={28} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height - 60, // Account for tab bar height approx
        backgroundColor: 'black',
    },
});

export default ReelItem;
