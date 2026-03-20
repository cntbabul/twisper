/** @jsxImportSource nativewind */
import { View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import PostComposer from '@/components/PostComposer';
import PostsList from '@/components/PostsList';
import { usePosts } from '@/hooks/usePosts';

const HomeFeed = (): React.JSX.Element => {
  const [refreshing, setRefreshing] = useState(false);
  const { refetch } = usePosts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View className="flex-1 bg-whatsapp-bg">
      <FlatList
        data={[{ id: 'header' }, { id: 'composer' }, { id: 'list' }]}
        renderItem={({ item }) => {
          if (item.id === 'header') return <Header title="Posts" subtitle="Stay connected" />;
          if (item.id === 'composer') return <PostComposer />;
          if (item.id === 'list') return <PostsList />;
          return null;
        }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#25D366"
            colors={["#25D366"]}
            progressBackgroundColor="#0B141A"
          />
        }
      />
    </View>
  );
};

export default HomeFeed;