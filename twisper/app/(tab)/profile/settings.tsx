/** @jsxImportSource nativewind */
import React from "react";
import { View, Text, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_SECTIONS = [
    {
        title: "Terminal Protocols",
        items: [
            { icon: "shield-checkmark-outline", label: "Security & Encryption", color: "#25D366" },
            { icon: "notifications-outline", label: "Signal Notifications", value: "Active", color: "#25D366" },
        ],
    },
    {
        title: "Interface Overrides",
        items: [
            { icon: "moon-outline", label: "Stealth Mode", value: "Always On", color: "#25D366" },
            { icon: "language-outline", label: "System Language", value: "EN-UTF8", color: "#25D366" },
        ],
    },
    {
        title: "Node Support",
        items: [
            { icon: "help-circle-outline", label: "Relay Support", color: "#25D366" },
            { icon: "information-circle-outline", label: "System Manifest", value: "v2.0.4", color: "#25D366" },
        ],
    },
];

const SettingsScreen = (): React.JSX.Element => {
    const { signOut } = useAuth();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-whatsapp-bg">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-10 pb-20">
                    {/* ULTRA Distinctive Header */}
                    <View className="mb-10">
                        <View className="flex-row items-center justify-between mb-4">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-12 h-12 rounded-3xl items-center justify-center bg-whatsapp-green/20 border-2 border-whatsapp-green shadow-lg shadow-whatsapp-green/40"
                            >
                                <Ionicons name="chevron-back" size={24} color="#25D366" />
                            </TouchableOpacity>
                            <View className="items-end">
                                <Text className="text-3xl font-black text-white tracking-widest uppercase font-Outfit">Control</Text>
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 rounded-full bg-whatsapp-green mr-2 glow-green" />
                                    <Text className="text-[10px] text-whatsapp-green font-black uppercase tracking-[0.4em] font-Outfit">Terminal Sync Active</Text>
                                </View>
                            </View>
                        </View>
                        <View className="h-[1px] w-full bg-whatsapp-green/20" />
                    </View>

                    {/* System Status Card */}
                    <View className="mb-10 p-5 rounded-3xl bg-glass-bg border border-glass-border overflow-hidden">
                        <View className="flex-row justify-between mb-4">
                            <View>
                                <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest font-Outfit">Network Status</Text>
                                <Text className="text-white font-black text-lg font-Outfit">Encrypted</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest font-Outfit">Latency</Text>
                                <Text className="text-whatsapp-green font-black text-lg font-Outfit">12ms</Text>
                            </View>
                        </View>
                        <View className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <View className="w-4/5 h-full bg-whatsapp-green" />
                        </View>
                        <View className="flex-row justify-between mt-2">
                            <Text className="text-white/20 text-[8px] font-bold font-Outfit">SIGNAL INTEGRITY: 98.4%</Text>
                            <Text className="text-whatsapp-green/40 text-[8px] font-bold font-Outfit">UPTIME: 142H</Text>
                        </View>
                    </View>

                    {MENU_SECTIONS.map((section) => (
                        <View key={section.title} className="mb-10">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-2 font-Outfit">
                                {section.title}
                            </Text>
                            <View className="rounded-3xl overflow-hidden bg-glass-bg border border-glass-border">
                                {section.items.map((item, index) => (
                                    <Pressable
                                        key={item.label}
                                        className={`flex-row items-center px-5 py-5 active:bg-white/5 ${index < section.items.length - 1 ? "border-b border-white/5" : ""}`}
                                    >
                                        <View className="w-10 h-10 rounded-xl items-center justify-center bg-whatsapp-green/10 border border-whatsapp-green/10">
                                            <Ionicons name={item.icon as any} size={18} color="#25D366" />
                                        </View>
                                        <View className="flex-1 ml-4">
                                            <Text className="text-white font-bold text-base font-Outfit tracking-tight">{item.label}</Text>
                                            {item.value && (
                                                <Text className="text-whatsapp-green font-medium text-[10px] uppercase tracking-widest mt-1 font-Outfit">{item.value}</Text>
                                            )}
                                        </View>
                                        <Ionicons name="chevron-forward" size={14} color="rgba(255, 255, 255, 0.2)" />
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Dangerous Operation Area */}
                    <Text className="text-red-500/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-2 font-Outfit">Danger Zone</Text>
                    <TouchableOpacity
                        className="rounded-3xl py-5 items-center overflow-hidden bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
                        onPress={() => signOut()}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="log-out" size={18} color="#FF6B6B" />
                            <Text className="ml-3 text-[#FF6B6B] font-black uppercase tracking-[0.2em] text-xs font-Outfit">Terminate Node Sync</Text>
                        </View>
                    </TouchableOpacity>

                    <Text className="text-center mt-12 text-white/20 text-[9px] font-black uppercase tracking-[0.5em] font-Outfit">Twisper Core v2.0.4</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
