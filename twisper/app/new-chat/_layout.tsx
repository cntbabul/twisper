/** @jsxImportSource nativewind */
import { Stack } from "expo-router";
import React from "react";

export default function NewChatLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
