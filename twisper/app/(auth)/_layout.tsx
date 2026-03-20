/** @jsxImportSource nativewind */
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'
import React from 'react'

const AuthLayout = (): React.JSX.Element | null => {
    const { isSignedIn, isLoaded } = useAuth()
    if (!isLoaded) {
        return null
    }

    if (isSignedIn) {
        return <Redirect href={'/(tab)'} />
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack >
    )
}

export default AuthLayout