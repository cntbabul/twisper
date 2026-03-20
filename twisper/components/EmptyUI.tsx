/** @jsxImportSource nativewind */
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import React from "react";

type EmptyUIProps = {
    title: string;
    subtitle?: string;
    iconName?: React.ComponentProps<typeof Ionicons>["name"];
    iconColor?: string;
    iconSize?: number;
    buttonLabel?: string;
    onPressButton?: () => void;
};

function EmptyUI({
    title,
    subtitle,
    iconName = "chatbubbles-outline",
    iconColor = "#3a3a3f",
    iconSize = 72,
    buttonLabel,
    onPressButton,
}: EmptyUIProps): React.JSX.Element {
    return (
        <View className="flex-1 items-center justify-center py-28">
            <View className="w-28 h-28 rounded-full bg-surface-card/50 items-center justify-center mb-5">
                {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
            </View>
            <Text className="text-foreground/80 text-lg font-semibold">{title}</Text>
            {subtitle ? (
                <Text className="text-muted-foreground text-sm mt-1.5 text-center px-8">{subtitle}</Text>
            ) : null}
            {buttonLabel && onPressButton ? (
                <Pressable
                    className="mt-6 bg-primary px-7 py-3 rounded-full active:scale-95"
                    onPress={onPressButton}
                    style={{
                        shadowColor: '#F4A261',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                    }}
                >
                    <Text className="text-surface-dark font-semibold text-sm">{buttonLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

export default EmptyUI;