/** @jsxImportSource nativewind */
import React, { useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const AnimatedBackground = (): React.JSX.Element => {
    const blob1X = useSharedValue(0)
    const blob1Y = useSharedValue(0)
    const blob2X = useSharedValue(width)
    const blob2Y = useSharedValue(height)
    const blob3X = useSharedValue(width / 2)
    const blob3Y = useSharedValue(height / 2)

    useEffect(() => {
        const animate = (valX: any, valY: any, duration: number) => {
            valX.value = withRepeat(
                withSequence(
                    withTiming(Math.random() * width, { duration: duration, easing: Easing.inOut(Easing.sin) }),
                    withTiming(Math.random() * width, { duration: duration, easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                true
            )
            valY.value = withRepeat(
                withSequence(
                    withTiming(Math.random() * height, { duration: duration + 2000, easing: Easing.inOut(Easing.sin) }),
                    withTiming(Math.random() * height, { duration: duration + 2000, easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                true
            )
        }

        animate(blob1X, blob1Y, 15000)
        animate(blob2X, blob2Y, 20000)
        animate(blob3X, blob3Y, 18000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }] as any,
    }))

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }] as any,
    }))

    const animatedStyle3 = useAnimatedStyle(() => ({
        transform: [{ translateX: blob3X.value }, { translateY: blob3Y.value }] as any,
    }))

    return (
        <View style={{ flex: 1 }}>
            <Animated.View
                style={[
                    { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.4, top: -200, left: -200 },
                    animatedStyle1
                ]}
            >
                <LinearGradient
                    colors={['#FF8A65', 'transparent']}
                    style={{ flex: 1, borderRadius: 200 }}
                />
            </Animated.View>
            <Animated.View
                style={[
                    { position: 'absolute', width: 500, height: 500, borderRadius: 250, opacity: 0.3, bottom: -250, right: -250 },
                    animatedStyle2
                ]}
            >
                <LinearGradient
                    colors={['#4DB6AC', 'transparent']}
                    style={{ flex: 1, borderRadius: 250 }}
                />
            </Animated.View>
            <Animated.View
                style={[
                    { position: 'absolute', width: 350, height: 350, borderRadius: 175, opacity: 0.35, top: height / 4, left: width / 4 },
                    animatedStyle3
                ]}
            >
                <LinearGradient
                    colors={['#FFB74D', 'transparent']}
                    style={{ flex: 1, borderRadius: 175 }}
                />
            </Animated.View>

            {/* Overlay to soften the colors */}
            <View
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(13, 13, 15, 0.6)'
                }}
            />
        </View>
    )
}

export default AnimatedBackground
