/** @jsxImportSource nativewind */
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { usePosts } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useAuth";
import type { Post } from "@/types";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";

interface PostsListProps {
    username?: string;
}

const PostsList = ({ username }: PostsListProps): React.JSX.Element => {
    const { data: currentUser } = useCurrentUser();
    const { posts, isLoading, error, refetch, toggleLike, deletePost } = usePosts(username);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const selectedPost = selectedPostId ? posts.find((p: Post) => p._id === selectedPostId) : null;

    const checkIsLiked = (postLikes: string[]) => {
        return currentUser && postLikes.includes(currentUser._id);
    };

    if (isLoading) {
        return (
            <View className="p-8 items-center">
                <ActivityIndicator size="large" color="#f4a261" />
                <Text className="text-secondary mt-2">Loading posts...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className="p-8 items-center">
                <Text className="text-red-400 mb-4 text-center">Failed to load posts</Text>
                <TouchableOpacity className="bg-primary px-6 py-2 rounded-full" onPress={() => refetch()}>
                    <Text className="text-surface-dark font-bold">Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (posts.length === 0) {
        return (
            <View className="p-8 items-center">
                <Text className="text-secondary">No posts yet</Text>
            </View>
        );
    }

    return (
        <>
            {posts.map((post: Post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onLike={toggleLike}
                    onDelete={deletePost}
                    onComment={(post: Post) => setSelectedPostId(post._id)}
                    currentUser={currentUser || null}
                    isLiked={checkIsLiked(post.likes) || false}
                />
            ))}

            <CommentsModal
                selectedPost={selectedPost || null}
                onClose={() => setSelectedPostId(null)}
            />
        </>
    )
}

export default PostsList;
