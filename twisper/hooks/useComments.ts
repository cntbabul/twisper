import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApi } from "@/lib/axios";

export const useComments = () => {
    const [commentText, setCommentText] = useState("");
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationFn: async ({ postId, content }: { postId: string, content: string }) => {
            const { data } = await apiWithAuth({
                method: "POST",
                url: `/social/posts/${postId}/comments`,
                data: { content },
            });
            return data;
        },
        onSuccess: () => {
            setCommentText("");
            queryClient.invalidateQueries({
                queryKey: ["posts"]
            });
        },
        onError: (error: any) => {
            console.error("Failed to post comment:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to post comment. Try again.");
        },
    })

    const createComment = (postId: string) => {
        if (!commentText.trim()) {
            Alert.alert("Empty Comment", "Please enter a comment.")
            return;
        }
        createCommentMutation.mutate({ postId, content: commentText.trim() })
    }

    return {
        commentText,
        setCommentText,
        createComment,
        isCreatingComment: createCommentMutation.isPending,
    };
}
