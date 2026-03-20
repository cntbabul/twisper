import { useApi } from "@/lib/axios";
import type { Video } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVideos = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const videosQuery = useQuery<Video[]>({
        queryKey: ["videos"],
        queryFn: async () => {
            const { data } = await apiWithAuth<Video[]>({ method: "GET", url: "/videos" });
            return data;
        },
    });

    const createVideoMutation = useMutation({
        mutationFn: async (videoData: Partial<Video>) => {
            const { data } = await apiWithAuth<Video>({
                method: "POST",
                url: "/videos",
                data: videoData,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });

    const interactVideoMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string, action: "like" | "dislike" | "view" }) => {
            const { data } = await apiWithAuth<Video>({
                method: "POST",
                url: `/videos/${id}/interact`,
                data: { action },
            });
            return data;
        },
        onSuccess: (updatedVideo) => {
            queryClient.setQueryData<Video[]>(["videos"], (old) => {
                return old?.map(v => v._id === updatedVideo._id ? updatedVideo : v);
            });
            queryClient.invalidateQueries({ queryKey: ["video", updatedVideo._id] });
        },
    });

    return {
        videos: videosQuery.data || [],
        isLoading: videosQuery.isLoading,
        error: videosQuery.error,
        refetch: videosQuery.refetch,
        createVideo: createVideoMutation.mutateAsync,
        interactVideo: interactVideoMutation.mutateAsync,
        isCreating: createVideoMutation.isPending,
        isInteracting: interactVideoMutation.isPending,
    };
};

export const useVideo = (id: string) => {
    const { apiWithAuth } = useApi();

    return useQuery<Video>({
        queryKey: ["video", id],
        queryFn: async () => {
            const { data } = await apiWithAuth<Video>({ method: "GET", url: `/videos/${id}` });
            return data;
        },
        enabled: !!id,
    });
};
