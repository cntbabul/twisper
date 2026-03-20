import { View, Text, Pressable, ActivityIndicator, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import logo from '@/assets/images/logo.png'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import useAuthSocial from '@/hooks/useSocialAuth'
import AnimatedBackground from '@/components/BackgroundAnimation'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

const AuthScreen = () => {
    const { handleSocialAuth, loadingStrategy } = useAuthSocial()
    const isLoading = loadingStrategy !== null

    return (
        <View className='flex-1 bg-whatsapp-bg'>
            <LinearGradient
                colors={['rgba(37, 211, 102, 0.05)', 'transparent', 'rgba(11, 20, 26, 0.5)']}
                style={StyleSheet.absoluteFill}
            />
            {/* Ambient Background Glows */}
            <View className="absolute inset-0 overflow-hidden">
                <View className="absolute -top-20 -left-20 w-80 h-80 bg-whatsapp-green/10 rounded-full blur-3xl" />
                <View className="absolute -bottom-20 -right-20 w-80 h-80 bg-whatsapp-green/5 rounded-full blur-3xl" />
                <AnimatedBackground />
            </View>

            <SafeAreaView className='flex-1'>
                <View className='items-center pt-10'>
                    <View className="rounded-full p-2 bg-whatsapp-green/10 border border-whatsapp-green/20 shadow-2xl shadow-whatsapp-green/40">
                        <Image
                            source={logo}
                            style={{ width: 80, height: 80 }}
                            contentFit='contain'
                        />
                    </View>
                    <Text className='text-4xl font-black text-whatsapp-green font-Outfit tracking-tighter mt-4' >
                        Twisper
                    </Text>
                    <View className="bg-whatsapp-green/10 px-3 py-1 rounded-full border border-whatsapp-green/20 mt-1">
                        <Text className="text-[10px] text-whatsapp-green font-black font-Outfit uppercase tracking-widest">
                            Connecting People . .
                        </Text>
                    </View>
                </View>

                <View className='flex-1 justify-center items-center px-8'>
                    <View className="relative">
                        <View className="absolute inset-0 bg-whatsapp-green/20 blur-3xl rounded-full" />
                        <Image
                            source={require('@/assets/images/auth.png')}
                            style={{ width: width - 80, height: height * 0.28 }}
                            contentFit='contain'
                        />
                    </View>

                    <View className='mt-12 items-center'>
                        <Text className='text-4xl font-black text-white font-Outfit text-center leading-tight'>
                            Connect to the{"\n"}
                            <Text className="text-whatsapp-green">
                                World ...
                            </Text>
                        </Text>
                        <Text className='text-base font-medium text-white/50 font-Outfit mt-4 text-center leading-6'>
                            Secure communication protocol for the{"\n"}next generation of digital nodes.
                        </Text>
                    </View>

                    {/* Auth Buttons */}
                    <View className='w-full gap-4 mt-12'>
                        {/* google */}
                        <Pressable
                            className='w-full flex-row items-center justify-center gap-3 bg-white py-4 rounded-2xl active:scale-[0.98] shadow-lg'
                            disabled={isLoading}
                            onPress={() => !isLoading && handleSocialAuth("oauth_google")}
                        >
                            {loadingStrategy === "oauth_google" ? <ActivityIndicator color="#000" /> : (
                                <>
                                    <View className="bg-black/5 p-1.5 rounded-lg">
                                        <Ionicons name='logo-google' size={20} color="#000" />
                                    </View>
                                    <Text className='text-lg font-black text-black font-Outfit'>
                                        Authorize with Google
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        {/* apple */}
                        <Pressable
                            className='w-full flex-row items-center justify-center gap-3 bg-whatsapp-bg border border-glass-border py-4 rounded-2xl active:scale-[0.98] glass-2 shadow-xl'
                            disabled={isLoading}
                            onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
                        >
                            {loadingStrategy === "oauth_apple" ? <ActivityIndicator color="#FFF" /> : (
                                <>
                                    <View className="bg-white/10 p-1.5 rounded-lg">
                                        <Ionicons name='logo-apple' size={20} color="#FFF" />
                                    </View>
                                    <Text className='text-lg font-black text-white font-Outfit'>
                                        Synchronize Apple ID
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Footer Footer */}
                <View className="pb-10 items-center">
                    <Text className="text-white/30 text-[10px] font-black font-Outfit uppercase tracking-widest">
                        Encrypted Connection • Secure Node Access
                    </Text>
                </View>
            </SafeAreaView>
        </View >
    )
}

export default AuthScreen