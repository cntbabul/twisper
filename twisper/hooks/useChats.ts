import { useApi } from "@/lib/axios";
import type { Chat } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useChats = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    const chatsQuery = useQuery<Chat[]>({
        queryKey: ["chats"],
        queryFn: async () => {
            const { data } = await apiWithAuth<Chat[]>({ method: "GET", url: "/chats" })
            return data;
        }
    });

    const createChatMutation = useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<Chat>({
                method: "POST",
                url: `/chats/with/${participantId}`
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
        }
    });

    return {
        chats: chatsQuery.data || [],
        isLoading: chatsQuery.isLoading,
        error: chatsQuery.error,
        refetch: chatsQuery.refetch,
        createChat: createChatMutation.mutateAsync,
        isCreating: createChatMutation.isPending,
    };
}

export const useGetOrCreateChat = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<Chat>({
                method: "POST",
                url: `/chats/with/${participantId}`
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] })
        }
    })
}
