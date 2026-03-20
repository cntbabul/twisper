import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { ClerkProvider } from '@clerk/expo'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import AuthSync from "@/components/AuthSync";
import { StatusBar } from "react-native";
import SocketConnection from "@/components/SocketConnection";
import React from "react";

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthSync />
          <SocketConnection />
          <StatusBar barStyle="light-content" />
          <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
            <Stack.Screen name="(tab)" options={{ animation: "fade" }} />
            <Stack.Screen
              name="new-chat"
              options={{
                animation: "slide_from_bottom",
                presentation: "modal",
                gestureEnabled: true,
                gestureDirection: "vertical",
                fullScreenGestureEnabled: true,
                animationDuration: 300
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
