import { useApi } from "@/lib/axios";
import type { Notification } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const { data: notifications, isLoading, error, refetch } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await apiWithAuth<{ notifications: Notification[] }>({
                method: "GET",
                url: "/social/notifications",
            });
            return data.notifications;
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            const { data } = await apiWithAuth({
                method: "DELETE",
                url: `/social/notifications/${notificationId}`,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        notifications: notifications || [],
        isLoading,
        error,
        refetch,
        deleteNotification: deleteNotificationMutation.mutate,
    };
};
