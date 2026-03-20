import { useApi } from "@/lib/axios";
import type { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const usersQuery = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await apiWithAuth<User[]>({ method: "GET", url: "/users" });
            return data;
        },
    });

    const followMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            const { data } = await apiWithAuth({
                method: "POST",
                url: `/users/follow/${targetUserId}`,
            });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });

    return {
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        refetch: usersQuery.refetch,
        toggleFollow: followMutation.mutate,
        isFollowing: followMutation.isPending,
    };
};

export const useUserProfile = (username: string) => {
    const { apiWithAuth } = useApi();

    return useQuery<User>({
        queryKey: ["userProfile", username],
        queryFn: async () => {
            const { data } = await apiWithAuth<User>({ method: "GET", url: `/users/profile/${username}` });
            return data;
        },
    });
};
