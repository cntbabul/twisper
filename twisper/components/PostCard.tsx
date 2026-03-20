/** @jsxImportSource nativewind */
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from "@expo/vector-icons";
import { formatDate, formatNumber } from "@/utils/formatters";
import type { Post, User } from "@/types";

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    onComment: (post: Post) => void;
    isLiked?: boolean;
    currentUser: User | null;
}

const PostCard = ({ currentUser, onDelete, onLike, post, isLiked, onComment }: PostCardProps): React.JSX.Element => {
    const isOwnPost = currentUser && post.user._id === currentUser._id;

    const handleDelete = () => {
        Alert.alert("Terminate Transmission", "Are you sure you want to scrub this data from the Hypergrid?", [
            { text: "Abort", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(post._id),
            },
        ]);
    };

    return (
        <View className="bg-whatsapp-bg mb-px p-6 border-b border-white/5">
            <View className="flex-row">
                <View className="mr-5">
                    <View className="rounded-2xl overflow-hidden border border-white/10 bg-glass-bg">
                        <Image
                            source={{ uri: post.user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                            style={{ width: 52, height: 52 }}
                        />
                    </View>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-wrap">
                            <Text className="font-black text-white text-base mr-2 tracking-tight font-Outfit">
                                {post.user.firstName} {post.user.lastName}
                            </Text>
                            <Text className="text-whatsapp-green font-black text-xs italic opacity-80 font-Outfit">
                                @{post.user.username}
                            </Text>
                            <Text className="text-white/40 text-[10px] ml-2 font-black uppercase tracking-widest font-Outfit">
                                · {formatDate(post.createdAt)}
                            </Text>
                        </View>
                        {isOwnPost && (
                            <TouchableOpacity onPress={handleDelete} hitSlop={15}>
                                <Feather name="more-horizontal" size={18} color="rgba(255, 255, 255, 0.4)" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {post.content && (
                        <Text className="text-white/90 text-base leading-6 mb-4 font-medium tracking-tight font-Outfit">
                            {post.content}
                        </Text>
                    )}

                    {post.image && (
                        <View className="mb-4 overflow-hidden rounded-3xl border border-white/5 bg-glass-bg">
                            <Image
                                source={{ uri: post.image }}
                                className="w-full h-64"
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    <View className="flex-row justify-between items-center mt-1">
                        <TouchableOpacity
                            className="flex-row items-center pr-4 py-2 active:opacity-60"
                            onPress={() => onComment(post)}
                        >
                            <Ionicons name="chatbubble-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                            <Text className="text-white/40 text-[11px] ml-1.5 font-black uppercase tracking-widest font-Outfit">
                                {formatNumber(typeof post.comments === 'object' ? post.comments.length : 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center pr-4 py-2 active:opacity-60">
                            <Ionicons name="repeat-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                            <Text className="text-white/40 text-[11px] ml-1.5 font-black uppercase tracking-widest font-Outfit">0</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center pr-4 py-2 active:opacity-60"
                            onPress={() => onLike(post._id)}
                        >
                            {isLiked ? (
                                <Ionicons name="heart" size={18} color="#25D366" />
                            ) : (
                                <Ionicons name="heart-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                            )}
                            <Text className={`text-[11px] ml-1.5 font-black uppercase tracking-widest font-Outfit ${isLiked ? "text-whatsapp-green" : "text-white/40"}`}>
                                {formatNumber(post.likes?.length || 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="p-2 active:opacity-60">
                            <Ionicons name="paper-plane-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PostCard;
