/** @jsxImportSource nativewind */
import { View, FlatList, ActivityIndicator, Text, RefreshControl } from 'react-native'
import Header from '@/components/Header'
import { useChats } from '@/hooks/useChats'
import ChatItem from '@/components/ChatItem'
import { useRouter } from 'expo-router'

const ChatsTab = (): React.JSX.Element => {
    const { chats, isLoading, refetch, error } = useChats();
    const router = useRouter();

    if (error) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-8">
                <Text className="text-red-400 text-center mb-4">Error loading chats</Text>
                <Header title="Chats" showCreateButton />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-whatsapp-bg">
            <Header
                title="Chats"
                subtitle="Encrypted nodes"
                showCreateButton
                onCreatePress={() => router.push("/new-chat")}
            />

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#25D366" />
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View className="px-6">
                            <ChatItem
                                chat={item}
                                onPress={() => router.push({
                                    pathname: "/chat/[id]",
                                    params: { id: item._id }
                                })}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center pt-32 px-12">
                            <Text className="text-white text-2xl font-black mb-3 tracking-tighter font-Outfit">No Transmissions</Text>
                            <Text className="text-white/40 text-center leading-5 font-Outfit">
                                Start a secure conversation by tapping the broadcast button above.
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                            tintColor="#25D366"
                            colors={["#25D366"]}
                            progressBackgroundColor="#0B141A"
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
};

export default ChatsTab;
