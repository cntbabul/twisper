import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from 'expo-linking'

function useAuthSocial() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        if (loadingStrategy) return;
        setLoadingStrategy(strategy);


        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl: Linking.createURL('/(tab)', { scheme: 'mobile' })
            });
            if (!createdSessionId || !setActive) {
                const provider = strategy === 'oauth_google' ? "Google" : "Apple";
                Alert.alert("Sign-in incomplete", `Failed to sign in with ${provider}`)
                setLoadingStrategy(null);
                return;
            }
            await setActive({ session: createdSessionId })
            setLoadingStrategy(null);

        } catch (error) {
            console.log("Error in social auth", error)
            setLoadingStrategy(null);
            const provider = strategy === "oauth_google" ? "Google" : "Apple"
            Alert.alert(
                "Error",
                `Failed to sign in with ${provider}`
            )
        }
    }
    return { handleSocialAuth, loadingStrategy }

}
export default useAuthSocial;