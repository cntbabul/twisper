/** @jsxImportSource nativewind */
import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePosts } from "@/hooks/usePosts";
import { useVideos } from "@/hooks/useVideos";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "@/components/EditProfileModal";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

const ProfileIndex = (): React.JSX.Element => {
    const router = useRouter();
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
    const onRefresh = () => {
        refetchPosts();
        refetchVideos();
        refetchProfile();
    }
    const { posts: userPosts, refetch: refetchPosts } = usePosts(currentUser?.username);
    const { videos, refetch: refetchVideos } = useVideos();
    const { isEditModalVisible, openEditModal, closeEditModal, formData, saveProfile, updateFormField, isUpdating, refetch: refetchProfile, } = useProfile();

    const userVideos = videos.filter(v => {
        const videoUserId = typeof v.userId === 'string' ? v.userId : v.userId?._id;
        return videoUserId === currentUser?._id;
    });

    if (isUserLoading) {
        return (
            <View className="flex-1 bg-whatsapp-bg items-center justify-center">
                <ActivityIndicator size="large" color="#25D366" />
            </View>
        );
    }

    if (!currentUser) return null;

    return (
        <SafeAreaView className="flex-1 bg-whatsapp-bg">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="#25D366" />
                }
            >
                {/* BANNER WITH GLASS OVERLAY */}
                <View className="relative">
                    <Image
                        source={currentUser.bannerImage || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop"}
                        style={{ width: '100%', height: 220 }}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(11, 20, 26, 0.95)']}
                        className="absolute bottom-0 left-0 right-0 h-48"
                    />
                    
                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                        <View 
                            className="flex-row items-end p-4 rounded-3xl bg-glass-bg border border-glass-border"
                        >
                            <View className="relative mr-4">
                                <View 
                                    className="rounded-full p-1 bg-whatsapp-green"
                                >
                                    <View className="rounded-full overflow-hidden border-2 border-whatsapp-bg">
                                        <Image
                                            source={currentUser.avatar}
                                            style={{ width: 80, height: 80 }}
                                        />
                                    </View>
                                </View>
                                <View 
                                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-whatsapp-bg items-center justify-center bg-whatsapp-green"
                                />
                            </View>
                            
                            <View className="flex-1 pb-1">
                                <View className="flex-row items-center mb-0.5">
                                    <Text className="text-2xl font-black text-white mr-1 tracking-tight font-Outfit">
                                        {currentUser.firstName}
                                    </Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#25D366" />
                                </View>
                                <Text className="text-white/60 font-medium text-sm font-Outfit">@{currentUser.username}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* BIO & QUICK ACTIONS SECTION */}
                <View className="px-6 py-6">
                    {currentUser.bio && (
                        <Text className="text-white/90 mb-6 text-base leading-6 font-medium tracking-tight">
                            {currentUser.bio}
                        </Text>
                    )}

                    <View className="flex-row mb-8 space-x-3">
                        <TouchableOpacity
                            onPress={openEditModal}
                            className="flex-1 h-12 rounded-2xl items-center justify-center bg-glass-bg border border-glass-border"
                        >
                            <Text className="text-white font-bold tracking-wide font-Outfit">Edit Profile</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => router.push("/profile/settings")}
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-3 bg-glass-bg border border-glass-border"
                        >
                            <Ionicons name="settings-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Stats in Horizontal Layout */}
                    <View className="flex-row justify-between mb-8 px-2">
                        <View className="items-center">
                            <Text className="text-white font-black text-xl">{userPosts.length}</Text>
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Transmissions</Text>
                        </View>
                        <View className="w-[1px] h-8 bg-white/10 self-center" />
                        <View className="items-center">
                            <Text className="text-white font-black text-xl">{currentUser.followers?.length || 0}</Text>
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Subscribers</Text>
                        </View>
                        <View className="w-[1px] h-8 bg-white/10 self-center" />
                        <View className="items-center">
                            <Text className="text-white font-black text-xl">{currentUser.following?.length || 0}</Text>
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Connected</Text>
                        </View>
                    </View>
                </View>

                {/* STICKY-LIKE TAB SWITCHER (GLASS) */}
                <View className="px-6 mb-4">
                    <View 
                        className="flex-row p-1.5 rounded-2xl bg-white/5 border border-white/5"
                    >
                        <TouchableOpacity
                            onPress={() => setActiveTab('posts')}
                            className="flex-1 flex-row h-10 items-center justify-center rounded-xl"
                            style={activeTab === 'posts' ? { backgroundColor: '#25D366' } : {}}
                        >
                            <Ionicons
                                name={activeTab === 'posts' ? "grid" : "grid-outline"}
                                size={18}
                                color={activeTab === 'posts' ? '#0B141A' : 'white'}
                            />
                            <Text 
                                className={`ml-2 font-black text-xs uppercase tracking-widest font-Outfit`}
                                style={activeTab === 'posts' ? { color: '#0B141A' } : { color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                                Posts
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => setActiveTab('reels')}
                            className="flex-1 flex-row h-10 items-center justify-center rounded-xl"
                            style={activeTab === 'reels' ? { backgroundColor: '#25D366' } : {}}
                        >
                            <Ionicons
                                name={activeTab === 'reels' ? "play-circle" : "play-circle-outline"}
                                size={20}
                                color={activeTab === 'reels' ? '#0B141A' : 'white'}
                            />
                            <Text 
                                className={`ml-2 font-black text-xs uppercase tracking-widest font-Outfit`}
                                style={activeTab === 'reels' ? { color: '#0B141A' } : { color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                                Reels
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* CONTENT SECTION GRID */}
                <View className="flex-row flex-wrap px-0.5 pb-20">
                    {activeTab === 'posts' ? (
                        userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <View
                                    key={post._id}
                                    style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }}
                                    className="p-0.5"
                                >
                                    <View className="flex-1 rounded-lg bg-white/5 overflow-hidden border border-white/5">
                                        <Image
                                            source={post.image || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop"}
                                            className="w-full h-full"
                                            contentFit="cover"
                                        />
                                        {!post.image && (
                                            <View className="absolute inset-x-2 inset-y-2 justify-center items-center">
                                                <Text className="text-white/40 text-[9px] text-center font-bold" numberOfLines={4}>
                                                    {post.content}
                                                </Text>
                                            </View>
                                        )}
                                        <View className="absolute bottom-1 right-1 flex-row items-center bg-black/40 px-1.5 py-0.5 rounded-full">
                                            <Ionicons name="heart" size={10} color="#25D366" />
                                            <Text className="text-white text-[8px] ml-0.5 font-black">{post.likes?.length || 0}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="w-full items-center py-32 opacity-20">
                                <Ionicons name="cube-outline" size={64} color="white" />
                                <Text className="text-white font-black mt-4 uppercase tracking-[4px] text-xs">Void Detected</Text>
                            </View>
                        )
                    ) : (
                        userVideos.length > 0 ? (
                            userVideos.map((video) => (
                                <TouchableOpacity
                                    key={video._id}
                                    style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.5 }}
                                    className="p-0.5"
                                    onPress={() => router.push("/reels")}
                                >
                                    <View className="flex-1 rounded-lg bg-white/5 overflow-hidden border border-white/5">
                                        <Image
                                            source={video.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop"}
                                            className="w-full h-full"
                                            contentFit="cover"
                                        />
                                        <View className="absolute bottom-3 left-3 flex-row items-center bg-black/40 px-2 py-1 rounded-full border border-white/10">
                                            <Ionicons name="play" size={10} color="white" />
                                            <Text className="text-white text-[10px] ml-1 font-black">{video.views || 0}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="w-full items-center py-32 opacity-20">
                                <Ionicons name="videocam-outline" size={64} color="white" />
                                <Text className="text-white font-black mt-4 uppercase tracking-[4px] text-xs">Zero Streams</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>

            <EditProfileModal
                isVisible={isEditModalVisible}
                onClose={closeEditModal}
                formData={formData}
                saveProfile={saveProfile}
                updateFormField={updateFormField}
                isUpdating={isUpdating}
            />
        </SafeAreaView>
    );
};

export default ProfileIndex;
