import { useSocketStore } from "@/lib/socket";
import { useAuth } from "@clerk/expo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const SocketConnection = () => {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const queryClient = useQueryClient();
    const connect = useSocketStore((state) => state.connect);
    const disconnect = useSocketStore((state) => state.disconnect);

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            getToken().then((token) => {
                if (token) {
                    connect(token, queryClient);
                }
            }).catch(err => {
                console.error(err);
            });
        } else {
            disconnect();
        }

    }, [isSignedIn, isLoaded, connect, disconnect, getToken, queryClient]);

    return null;
};

export default SocketConnection;