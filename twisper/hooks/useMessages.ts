import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/axios";
import type { Message } from "@/types";

//messages/chat/:chatId
export const useMessages = (chatId: string) => {
    const { apiWithAuth } = useApi();

    return useQuery({
        queryKey: ["messages", chatId],
        queryFn: async (): Promise<Message[]> => {
            const { data } = await apiWithAuth<Message[]>({
                method: "GET",
                url: `/messages/chat/${chatId}`
            })
            return data
        },
        enabled: !!chatId
    })
}