/** @jsxImportSource nativewind */
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '@/hooks/useUsers';
import { useChats } from '@/hooks/useChats';
import { useRouter } from 'expo-router';
import UserItem from '@/components/UserItem';
import EmptyUI from '@/components/EmptyUI';

const NewChatScreen = (): React.JSX.Element => {
    const [searchQuery, setSearchQuery] = useState("");
    const { users, isLoading } = useUsers();
    const { createChat, isCreating } = useChats();
    const router = useRouter();

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        return users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleSelectUser = async (user: any) => {
        const chat = await createChat(user._id);
        if (chat) {
            router.replace({
                pathname: "/chat/[id]",
                params: {
                    id: chat._id,
                    name: user.name,
                    avatar: user.avatar,
                    participantId: user._id
                }
            });
        }
    };

    return (
        <View className="flex-1 bg-surface-dark">
            {/* Custom Header since it is a modal */}
            <View className="px-4 py-4 border-b border-surface-light/10 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <Ionicons name="close" size={28} color="#A0AEC0" />
                </TouchableOpacity>
                <Text className="text-white font-black text-xl tracking-tight">New Signal</Text>
                <View className="w-8" />
            </View>

            <View className="px-5 py-4">
                <View className="flex-row items-center bg-surface-light/5 rounded-2xl px-4 py-3 border border-surface-light/10">
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                        placeholder="Search operators..."
                        className="flex-1 ml-3 text-base text-white"
                        placeholderTextColor="#64748B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {isLoading || isCreating ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#F4A261" />
                    <Text className="text-muted-foreground mt-4 font-bold uppercase tracking-widest text-xs">
                        {isCreating ? "Establishing Link..." : "Scanning Grid..."}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View className="px-4">
                            <UserItem
                                user={item}
                                onPress={() => handleSelectUser(item)}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <EmptyUI
                            title="No Results"
                            subtitle="No operators found matching your criteria."
                            iconName="search-outline"
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
};

export default NewChatScreen;
