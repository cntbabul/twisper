import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

//auth/callback
export const useAuthCallBack = () => {
    const { apiWithAuth } = useApi();

    return useMutation({
        mutationFn: async () => {
            const { data } = await apiWithAuth<User>({ method: "POST", url: "/auth/callback" })
            return data
        }
    })
}

//auth/me
export const useCurrentUser = () => {
    const { apiWithAuth } = useApi();

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const { data } = await apiWithAuth<User>({
                method: "GET",
                url: "/auth/me"
            })
            return data
        }
    })
}