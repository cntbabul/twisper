import axios from "axios";
import { useAuth } from "@clerk/expo";
import { useCallback } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Create a reasonable default when EXPO_PUBLIC_API_URL is not set.
// In Expo, environment variables may not be loaded unless configured correctly.
const DEFAULT_API_URL = (() => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    if (!process.env.EXPO_PUBLIC_API_URL) {
        console.error("EXPO_PUBLIC_API_URL is not defined");
    }

    if (Platform.OS === "android") {
        const debuggerHost = Constants.expoConfig?.hostUri;
        if (debuggerHost) {
            const host = debuggerHost.split(":")[0];
            return `http://${host}:3000/api/v1`;
        }
        // Android emulator default host for local machine
        return "http://10.0.2.2:3000/api/v1";
    }

    // iOS simulator / web
    return "http://localhost:3000/api/v1";
})();

const API_URL = DEFAULT_API_URL;
console.log("apiurl", API_URL)


const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Response interceptor registered once
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const fullUrl = `${error.config?.baseURL || ""}${error.config?.url}`;
            console.error(
                `API request failed: ${error.config?.method?.toUpperCase()} ${fullUrl}`,
                {
                    status: error.response.status,
                    endpoint: fullUrl,
                    method: error.config?.method,
                    error,
                },
            );
        } else if (error.request) {
            const fullUrl = `${error.config?.baseURL || ""}${error.config?.url}`;
            console.warn("API request failed - no response", {
                endpoint: fullUrl,
                method: error.config?.method,
                error,
            });
        }
        return Promise.reject(error);
    },
);

export const useApi = () => {
    const { getToken } = useAuth();

    const apiWithAuth = useCallback(
        async <T>(config: Parameters<typeof api.request>[0]) => {
            const token = await getToken();
            return api.request<T>({
                ...config,
                headers: {
                    ...config.headers,
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
        },
        [getToken],
    );

    return { api, apiWithAuth };
};
