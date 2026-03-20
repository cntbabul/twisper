import { useApi } from "@/lib/axios";
import type { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePosts = (username?: string) => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const { data: posts, isLoading, error, refetch } = useQuery({
        queryKey: username ? ["posts", username] : ["posts"],
        queryFn: async () => {
            const url = username ? `/social/posts/user/${username}` : "/social/posts";
            const { data } = await apiWithAuth<{ posts: Post[] }>({ method: "GET", url });
            return data.posts;
        },
    });

    const createPostMutation = useMutation({
        mutationFn: async (postData: { content: string; image?: string }) => {
            const { data } = await apiWithAuth<{ post: Post }>({
                method: "POST",
                url: "/social/posts",
                data: postData,
            });
            return data.post;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const likePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            const { data } = await apiWithAuth({
                method: "POST",
                url: `/social/posts/${postId}/like`,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            if (username) queryClient.invalidateQueries({ queryKey: ["posts", username] });
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            const { data } = await apiWithAuth({
                method: "DELETE",
                url: `/social/posts/${postId}`,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            if (username) queryClient.invalidateQueries({ queryKey: ["posts", username] });
        },
    });

    return {
        posts: posts || [],
        isLoading,
        error,
        refetch,
        createPost: createPostMutation.mutate,
        isCreating: createPostMutation.isPending,
        toggleLike: likePostMutation.mutate,
        deletePost: deletePostMutation.mutate,
    };
};
