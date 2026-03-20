/** @jsxImportSource nativewind */
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { Ionicons, Foundation } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';

const TabsLayout = (): React.JSX.Element | null => {
    const { isSignedIn, isLoaded } = useAuth()
    if (!isLoaded) return null
    if (!isSignedIn) return <Redirect href="/(auth)" />
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0B141A" }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        bottom: 15,
                        left: 15,
                        right: 15,
                        height: 75,
                        backgroundColor: "#0B141A",
                        borderRadius: 35,
                        borderTopWidth: 0,
                        elevation: 25,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.58,
                        shadowRadius: 16.00,
                        paddingBottom: 15,
                        paddingTop: 10,
                        overflow: "hidden",
                    },
                    tabBarActiveTintColor: "#25D366",
                    tabBarInactiveTintColor: "#8596A0",
                    tabBarLabelStyle: { fontSize: 11, fontWeight: "900", fontFamily: "Outfit", marginTop: -5 },

                }}
            >
                <Tabs.Screen name="index" options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    )
                }} />
                <Tabs.Screen
                    name="reels"
                    options={{
                        title: "Reels",
                        tabBarIcon: ({ color, focused, size }) => (
                            <Foundation name={focused ? "play-video" : "play-video"} size={24} color={color} />
                        )
                    }} />
                <Tabs.Screen name="search" options={{
                    title: "Search",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
                    )
                }} />

                <Tabs.Screen name="chats" options={{
                    title: "Chats",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color={color} />
                    )
                }} />

                <Tabs.Screen name="notifications" options={{
                    title: "Alerts",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons name={focused ? "notifications" : "notifications-outline"} size={24} color={color} />
                    )
                }} />


                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused, size }) => (
                            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                        )
                    }} />
            </Tabs>
        </SafeAreaView>
    )
}

export default TabsLayout