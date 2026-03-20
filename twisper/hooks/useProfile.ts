import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../lib/axios";
import { useCurrentUser } from "./useAuth";

export const useProfile = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
    });

    const { data: currentUser } = useCurrentUser();

    const updateProfileMutation = useMutation({
        mutationFn: async (profileData: any) => {
            const { data } = await apiWithAuth({
                method: "PUT",
                url: "/users/profile",
                data: profileData,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            setIsEditModalVisible(false);
            Alert.alert("Success", "Profile updated successfully");
        },
        onError: (error: any) => {
            console.error("Failed to update profile:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
        }
    });

    const openEditModal = () => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                bio: currentUser.bio || "",
                location: currentUser.location || "",
            });
        }
        setIsEditModalVisible(true);
    };

    const updateFormField = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return {
        isEditModalVisible,
        formData,
        openEditModal,
        closeEditModal: () => setIsEditModalVisible(false),
        saveProfile: () => updateProfileMutation.mutate(formData),
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
    };
};
