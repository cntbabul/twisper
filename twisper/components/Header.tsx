/** @jsxImportSource nativewind */
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showCreateButton?: boolean;
    onCreatePress?: () => void;
}

const Header = ({
    title = "Twisper",
    subtitle,
    showCreateButton = false,
    onCreatePress
}: HeaderProps): React.JSX.Element => {

    const handleCreatePress = () => {
        if (onCreatePress) {
            onCreatePress();
        } else {
            // router.push("/new-chat");
        }
    };

    return (
        <SafeAreaView edges={['top']} className="bg-whatsapp-bg">
            <View className='px-6 pt-2 pb-5'>
                <View className='flex-row items-center justify-between'>
                    <View>
                        <Text className='text-3xl font-black text-white tracking-widest uppercase font-Outfit'>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text className='text-[10px] uppercase tracking-[0.3em] font-black text-white/40 mt-1 font-Outfit'>
                                {subtitle}
                            </Text>
                        )}
                    </View>

                    {showCreateButton && (
                        <Pressable
                            onPress={handleCreatePress}
                            className="active:scale-95"
                        >
                            <View 
                                className='w-12 h-12 rounded-2xl items-center justify-center bg-glass-bg border border-glass-border'
                            >
                                <Ionicons name='add-outline' size={28} color="#25D366" />
                            </View>
                        </Pressable>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Header