/** @jsxImportSource nativewind */
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useAuth';
import Header from '@/components/Header';

const TRENDING_TOPICS = [
    { topic: "#TwisperApp", tweets: "1.2M", category: "Technology" },
    { topic: "#ExpoDev", tweets: "850K", category: "Development" },
    { topic: "#AgenticAI", tweets: "2.5M", category: "AI" },
    { topic: "#JavaScript", tweets: "1.1M", category: "Coding" },
];

const SearchScreen = (): React.JSX.Element => {
    const [searchQuery, setSearchQuery] = useState("");
    const { users, isLoading, toggleFollow, refetch } = useUsers();
    const { data: currentUser } = useCurrentUser();

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return users.filter(user =>
            user._id !== currentUser?._id && (
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [users, searchQuery, currentUser]);

    const handleUserPress = (userId: string) => {
        // Navigate to chat or profile
        // router.push(`/(tab)/profile`); todo
    };

    return (
        <View className="flex-1 bg-whatsapp-bg">
            <Header title="Search" />

            {/* Search Bar */}
            <View className="px-5 py-4 border-b border-white/5">
                <View className="flex-row items-center bg-glass-bg rounded-2xl px-5 py-3 border border-glass-border">
                    <Feather name="search" size={18} color="#25D366" />
                    <TextInput
                        placeholder="Scan Hypergrid..."
                        className="flex-1 ml-3 text-base text-white font-medium font-Outfit"
                        placeholderTextColor="#54656F"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.4)" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {searchQuery.length > 0 ? (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between px-6 py-5 border-b border-white/5 active:bg-glass-bg/50">
                            <TouchableOpacity
                                className="flex-row items-center flex-1"
                                onPress={() => handleUserPress(item._id)}
                            >
                                <View className="relative">
                                    <Image
                                        source={{ uri: item.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                                        className="w-14 h-14 rounded-2xl bg-glass-bg border border-glass-border"
                                    />
                                    <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-whatsapp-green border-2 border-whatsapp-bg" />
                                </View>
                                <View className="ml-4">
                                    <View className="flex-row items-center mb-0.5">
                                        <Text className="text-white font-black text-base mr-1.5 font-Outfit">
                                            {item.firstName} {item.lastName}
                                        </Text>
                                        <Ionicons name="shield-checkmark" size={14} color="#25D366" />
                                    </View>
                                    <Text className="text-whatsapp-green font-bold text-sm font-Outfit">@{item.username}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`px-6 py-2 rounded-xl border ${currentUser?.following?.includes(item._id)
                                    ? "bg-transparent border-white/10"
                                    : "bg-whatsapp-green border-whatsapp-green"
                                    }`}
                                onPress={() => toggleFollow(item._id)}
                            >
                                <Text className={`font-black uppercase tracking-widest text-[10px] font-Outfit ${currentUser?.following?.includes(item._id) ? "text-white/40" : "text-white"
                                    }`}>
                                    {currentUser?.following?.includes(item._id) ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        !isLoading && (
                            <View className="p-10 items-center">
                                <Text className="text-white/40 font-bold italic font-Outfit">User not found in grid &quot;{searchQuery}&quot;</Text>
                            </View>
                        )
                    }
                />
            ) : (
                <FlatList
                    data={[{ id: 'title' }, ...TRENDING_TOPICS]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        if (index === 0) {
                            return (
                                <View className="px-6 pt-8 pb-4">
                                    <Text className="text-2xl font-black tracking-tighter font-Outfit text-whatsapp-green">Hot Nodes</Text>
                                </View>
                            );
                        }
                        const topic = item as typeof TRENDING_TOPICS[0];
                        return (
                            <TouchableOpacity className="px-6 py-5 border-b border-white/5 active:bg-glass-bg/50">
                                <View className="flex-row justify-between items-start mb-1">
                                    <Text className="text-[10px] text-whatsapp-green font-black uppercase tracking-[0.2em] font-Outfit">
                                        {topic.category} {"// POPULAR"}
                                    </Text>
                                    <Ionicons name="ellipsis-horizontal" size={16} color="rgba(255, 255, 255, 0.2)" />
                                </View>
                                <Text className="text-lg font-black text-white mb-1 tracking-tight font-Outfit">{topic.topic}</Text>
                                <Text className="text-white/40 text-xs font-bold font-Outfit">{topic.tweets} Transmissions</Text>
                            </TouchableOpacity>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                            tintColor="#25D366"
                            colors={["#25D366"]}
                            progressBackgroundColor="#0B141A"
                        />
                    }
                />
            )}
        </View>
    );
};

export default SearchScreen;
