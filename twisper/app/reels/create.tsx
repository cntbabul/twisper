/** @jsxImportSource nativewind */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useVideos } from '@/hooks/useVideos';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '@/lib/axios';

const CreateReelScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const { refetch } = useVideos();
    const router = useRouter();
    const { apiWithAuth } = useApi();

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const handlePublish = async () => {
        if (!videoUri) {
            Alert.alert("Error", "Please select a video first");
            return;
        }

        setIsPublishing(true);
        try {
            const formData = new FormData();
            formData.append("title", title || "New Reel");
            formData.append("description", description);
            
            const uriParts = videoUri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append("video", {
                uri: videoUri,
                name: `reel.${fileType}`,
                type: `video/${fileType}`,
            } as any);

            await apiWithAuth({
                method: "POST",
                url: "/videos",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Alert.alert("Success", "Your reel has been published!");
            refetch();
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to publish reel");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center p-5 border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-black text-xl tracking-tighter italic">CREATE REEL</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                <TouchableOpacity 
                    onPress={pickVideo}
                    className="w-full aspect-[9/16] bg-white/5 border-2 border-dashed border-white/20 rounded-3xl items-center justify-center mb-6 overflow-hidden"
                >
                    {videoUri ? (
                        <View className="items-center">
                            <Ionicons name="checkmark-circle" size={64} color="#00FF94" />
                            <Text className="text-[#00FF94] font-bold mt-2">Video Selected</Text>
                            <Text className="text-white/40 text-xs mt-1">Tap to change</Text>
                        </View>
                    ) : (
                        <View className="items-center">
                            <Ionicons name="videocam" size={64} color="white" />
                            <Text className="text-white font-bold mt-4">Pick a Video</Text>
                            <Text className="text-white/40 text-xs mt-1">MP4, MOV supported</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View className="gap-4">
                    <View>
                        <Text className="text-white/40 text-xs font-bold uppercase mb-2 ml-1">Title</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Give your reel a name..."
                            placeholderTextColor="#666"
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-medium"
                        />
                    </View>

                    <View>
                        <Text className="text-white/40 text-xs font-bold uppercase mb-2 ml-1">Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Tell them more about it..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={3}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-medium h-32"
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={handlePublish}
                    disabled={isPublishing}
                    className={`mt-10 mb-20 p-5 rounded-2xl items-center justify-center ${isPublishing ? 'bg-white/20' : 'bg-[#FF4B4B]'}`}
                >
                    {isPublishing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">PUBLISH MOMENT</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateReelScreen;
