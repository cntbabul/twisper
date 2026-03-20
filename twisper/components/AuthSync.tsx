import { useAuthCallBack } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";

const AuthSync = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { mutate: syncUser } = useAuthCallBack();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isSignedIn && user && !hasSynced.current && !user.publicMetadata?.isSynced) {
            hasSynced.current = true;

            syncUser(undefined, {
                onSuccess: (data: any) => {
                    console.log("🟢 User synced with backend:", data?.name || user?.fullName);
                },
                onError: (error: any) => {
                    console.log("❌ User syncing failed for the user:", user?.fullName, error);
                }
            })
        }
        if (!isSignedIn) {
            hasSynced.current = false;
        }
    }, [isSignedIn, user, syncUser])

    return null;
}
export default AuthSync;