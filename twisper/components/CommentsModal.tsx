/** @jsxImportSource nativewind */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useAuth";
import type { Post } from "@/types";
// import { Ionicons } from '@expo/vector-icons';

interface CommentsModalProps {
    selectedPost: Post | null;
    onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps): React.JSX.Element => {
    const { commentText, setCommentText, createComment, isCreatingComment } = useComments();
    const { data: currentUser } = useCurrentUser();

    const handleClose = () => {
        setCommentText("");
        onClose();
    }

    return (
        <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-whatsapp-bg">
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-glass-border">
                    <TouchableOpacity onPress={handleClose}>
                        <Text className="text-whatsapp-green text-lg font-Outfit">Close</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-white font-Outfit">Comments</Text>
                    <View className="w-12" />
                </View>

                {selectedPost && (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="flex-1"
                    >
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            {/* ORIGINAL POST */}
                            <View className="border-b border-glass-border bg-whatsapp-bg/50 p-4">
                                <View className="flex-row">
                                    <Image
                                        source={{ uri: selectedPost.user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                                        className="w-12 h-12 rounded-full mr-3 bg-glass-bg border border-glass-border"
                                    />

                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="font-bold text-white mr-1 font-Outfit">
                                                {selectedPost.user.firstName} {selectedPost.user.lastName}
                                            </Text>
                                            <Text className="text-whatsapp-green text-sm ml-1 font-Outfit">@{selectedPost.user.username}</Text>
                                        </View>

                                        {selectedPost.content && (
                                            <Text className="text-white text-base leading-5 mb-3 font-Outfit">
                                                {selectedPost.content}
                                            </Text>
                                        )}

                                        {selectedPost.image && (
                                            <Image
                                                source={{ uri: selectedPost.image }}
                                                className="w-full h-48 rounded-2xl mb-3 bg-surface-light/10"
                                                resizeMode="cover"
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* COMMENTS LIST */}
                            {(selectedPost.comments as any[]).map((comment) => (
                                <View key={comment._id} className="border-b border-glass-border p-4">
                                    <View className="flex-row">
                                        <Image
                                            source={{ uri: comment.user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                                            className="w-10 h-10 rounded-full mr-3 bg-glass-bg border border-glass-border"
                                        />

                                        <View className="flex-1">
                                            <View className="flex-row items-center mb-1">
                                                <Text className="font-bold text-white mr-1 font-Outfit">
                                                    {comment.user.firstName} {comment.user.lastName}
                                                </Text>
                                                <Text className="text-whatsapp-green text-xs ml-1 font-Outfit">@{comment.user.username}</Text>
                                            </View>

                                            <Text className="text-white text-base leading-5 mb-2 font-Outfit">{comment.content}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            {selectedPost.comments.length === 0 && (
                                <View className="p-8 items-center">
                                    <Text className="text-white/40 font-Outfit italic">Be the first node to respond...</Text>
                                </View>
                            )}
                        </ScrollView>

                        {/* ADD COMMENT INPUT */}
                        <View className="p-4 border-t border-glass-border bg-whatsapp-bg pb-10">
                            <View className="flex-row items-start">
                                <Image
                                    source={{ uri: currentUser?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                                    className="w-10 h-10 rounded-full mr-3 bg-glass-bg border border-glass-border"
                                />

                                <View className="flex-1">
                                    <TextInput
                                        className="bg-glass-bg border border-glass-border rounded-2xl p-3 text-white text-base mb-3 min-h-[80px] font-Outfit"
                                        placeholder="Transmit your reply..."
                                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                        value={commentText}
                                        onChangeText={setCommentText}
                                        multiline
                                        textAlignVertical="top"
                                    />

                                    <TouchableOpacity
                                        className={`px-6 py-2 rounded-2xl self-end ${commentText.trim() ? "bg-whatsapp-green" : "bg-glass-bg border border-glass-border"}`}
                                        onPress={() => createComment(selectedPost._id)}
                                        disabled={isCreatingComment || !commentText.trim()}
                                    >
                                        {isCreatingComment ? (
                                            <ActivityIndicator size={"small"} color="#0B141A" />
                                        ) : (
                                            <Text className={`font-black uppercase tracking-widest text-xs font-Outfit ${commentText.trim() ? "text-whatsapp-bg" : "text-white/20"}`}>
                                                Transmit
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                )}
            </View>
        </Modal>
    )
}

export default CommentsModal;
