import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApi } from "@/lib/axios";

export const useCreatePost = () => {
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: async (postData: { content: string; imageUri?: string }) => {
            const formData = new FormData();

            if (postData.content) formData.append("content", postData.content);

            if (postData.imageUri) {
                const uriParts = postData.imageUri.split(".");
                const fileType = uriParts[uriParts.length - 1].toLowerCase();

                const mimeTypeMap: Record<string, string> = {
                    png: "image/png",
                    gif: "image/gif",
                    webp: "image/webp",
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                };
                const mimeType = mimeTypeMap[fileType] || "image/jpeg";

                formData.append("image", {
                    uri: postData.imageUri,
                    name: `image.${fileType}`,
                    type: mimeType,
                } as any);
            }

            return apiWithAuth({
                method: "POST",
                url: "/social/posts",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            setContent("");
            setSelectedImage(null);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            Alert.alert("Success", "Post created successfully!");
        },
        onError: (error: any) => {
            console.error("Failed to create post:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to create post. Please try again.");
        },
    });

    const handleImagePicker = async (useCamera: boolean = false) => {
        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.status !== "granted") {
            const source = useCamera ? "camera" : "photo library";
            Alert.alert("Permission needed", `Please grant permission to access your ${source}`);
            return;
        }

        const pickerOptions: ImagePicker.ImagePickerOptions = {
            allowsEditing: true,
            // ["aspect"]: [16, 9],
            quality: 0.8,
        };

        const result = useCamera
            ? await ImagePicker.launchCameraAsync(pickerOptions)
            : await ImagePicker.launchImageLibraryAsync({
                ...pickerOptions,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

        if (!result.canceled) setSelectedImage(result.assets[0].uri);
    };

    const createPost = () => {
        if (!content.trim() && !selectedImage) {
            Alert.alert("Empty Post", "Please write something or add an image before posting!");
            return;
        }

        const postData: { content: string; imageUri?: string } = {
            content: content.trim(),
        };

        if (selectedImage) postData.imageUri = selectedImage;

        createPostMutation.mutate(postData);
    };

    return {
        content,
        setContent,
        selectedImage,
        isCreating: createPostMutation.isPending,
        pickImageFromGallery: () => handleImagePicker(false),
        takePhoto: () => handleImagePicker(true),
        removeImage: () => setSelectedImage(null),
        createPost,
    };
};
