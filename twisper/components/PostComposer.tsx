import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useUser } from "@clerk/expo";
import { LinearGradient } from 'expo-linear-gradient';

const PostComposer = (): React.JSX.Element => {
    const { content, setContent, selectedImage, isCreating, pickImageFromGallery, takePhoto, removeImage, createPost } = useCreatePost();
    const { user } = useUser();

    return (
        <View className="p-6 bg-whatsapp-bg mb-px border-b border-white/5">
            <View className="flex-row">
                <Image source={{ uri: user?.imageUrl }} className="w-12 h-12 rounded-2xl bg-glass-bg border border-glass-border" />
                <View className="flex-1 ml-4 bg-glass-bg border border-glass-border rounded-2xl px-4 py-2">
                    <TextInput
                        className="text-base text-white font-medium leading-6 font-Outfit"
                        placeholder="Broadcast to the Hypergrid..."
                        placeholderTextColor="#54656F"
                        multiline
                        value={content}
                        onChangeText={setContent}
                        maxLength={280}
                        style={{ minHeight: 60, textAlignVertical: 'top' }}
                    />
                </View>
            </View>

            {selectedImage && (
                <View className="mt-4 ml-16">
                    <View className="relative rounded-3xl overflow-hidden border border-glass-border bg-glass-bg">
                        <Image
                            source={{ uri: selectedImage }}
                            className="w-full h-56"
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            className="absolute top-3 right-3 w-10 h-10 bg-black/70 rounded-2xl items-center justify-center border border-white/10"
                            onPress={removeImage}
                        >
                            <Feather name="x" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View className="flex-row justify-between items-center mt-6 ml-16">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="mr-6 p-2 rounded-xl bg-glass-bg border border-glass-border active:bg-white/10"
                        onPress={pickImageFromGallery}
                    >
                        <Feather name="image" size={20} color="#25D366" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="mr-6 p-2 rounded-xl bg-glass-bg border border-glass-border active:bg-white/10"
                        onPress={takePhoto}
                    >
                        <Feather name="camera" size={20} color="#25D366" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center">
                    {content.length > 0 && (
                        <Text className={`text-[10px] font-black mr-4 font-Outfit ${content.length > 260 ? "text-red-500" : "text-whatsapp-green opacity-60"}`}>
                            {280 - content.length}
                        </Text>
                    )}

                    <TouchableOpacity
                        disabled={!(content.trim().length > 0 || selectedImage) || isCreating}
                        onPress={createPost}
                        className="active:scale-95"
                    >
                        <LinearGradient
                            colors={content.trim().length > 0 || selectedImage ? ['#25D366', '#128C7E'] : ['#1A1A1E', '#141417']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="px-8 py-3 rounded-2xl items-center justify-center"
                        >
                            {isCreating ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text className={`font-black text-sm uppercase tracking-wider font-Outfit ${content.trim().length > 0 || selectedImage ? "text-white" : "text-white/20"}`}>
                                    Post
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PostComposer;
