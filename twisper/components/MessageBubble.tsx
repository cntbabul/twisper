/** @jsxImportSource nativewind */
import { Message, MessageSender } from "@/types";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { format, isToday, isYesterday } from "date-fns";

// Date separator shown between message groups
export function DateSeparator({ date }: { date: string }): React.JSX.Element {
    const d = new Date(date);
    let label = format(d, "MMM d, yyyy");
    if (isToday(d)) label = "Today";
    else if (isYesterday(d)) label = "Yesterday";

    return (
        <View className="items-center my-4">
            <View className="bg-glass-bg px-4 py-1.5 rounded-full border border-glass-border">
                <Text className="text-white/60 text-[11px] font-medium font-Outfit">
                    {label}
                </Text>
            </View>
        </View>
    );
}

// Typing indicator with animated dots feel
export function TypingIndicator({ avatar }: { avatar?: string }): React.JSX.Element {
    return (
        <View className="flex-row justify-start items-end gap-2 mb-1">
            {avatar && (
                <Image
                    source={{ uri: avatar }}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                />
            )}
            <View className="bg-glass-bg rounded-2xl rounded-bl-sm border border-glass-border px-4 py-3">
                <View className="flex-row items-center gap-1">
                    <View className="w-2 h-2 rounded-full bg-whatsapp-green opacity-40" />
                    <View className="w-2 h-2 rounded-full bg-whatsapp-green opacity-60" />
                    <View className="w-2 h-2 rounded-full bg-whatsapp-green opacity-80" />
                </View>
            </View>
        </View>
    );
}

function MessageBubble({ message, isFromMe, showAvatar }: {
    message: Message;
    isFromMe: boolean;
    showAvatar?: boolean;
}): React.JSX.Element {
    const time = message.createdAt ? format(new Date(message.createdAt), "h:mm a") : "";
    const isOptimistic = message._id.startsWith("temp-");
    const senderAvatar = !isFromMe && typeof message.sender !== "string"
        ? (message.sender as MessageSender).avatar
        : undefined;

    return (
        <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"} items-end gap-2`}>
            {/* Participant avatar for received messages */}
            {!isFromMe && (
                <View style={{ width: 28 }}>
                    {showAvatar && senderAvatar ? (
                        <Image
                            source={{ uri: senderAvatar }}
                            style={{ width: 28, height: 28, borderRadius: 14 }}
                        />
                    ) : null}
                </View>
            )}

            <View
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${isFromMe
                    ? "bg-whatsapp-green rounded-br-sm shadow-sm shadow-whatsapp-green/20"
                    : "bg-glass-bg rounded-bl-sm border border-glass-border"
                    }`}
                style={isOptimistic ? { opacity: 0.6 } : undefined}
            >
                <Text className={`text-[15px] leading-5 font-Outfit ${isFromMe ? "text-whatsapp-bg font-medium" : "text-white"}`}>
                    {message.text}
                </Text>
                <Text
                    className={`text-[10px] mt-1 font-Outfit ${isFromMe ? "text-whatsapp-bg/60" : "text-white/40"} text-right`}
                >
                    {isOptimistic ? "Sending..." : time}
                </Text>
            </View>
        </View>
    );
}

export default MessageBubble;