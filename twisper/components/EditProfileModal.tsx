import { View, Text, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Modal } from 'react-native'

interface EditProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        firstName: string;
        lastName: string;
        bio: string;
        location: string;
    };
    saveProfile: () => void;
    updateFormField: (field: string, value: string) => void;
    isUpdating: boolean;
}


const EditProfileModal = ({ formData, isUpdating, isVisible, onClose, saveProfile, updateFormField }: EditProfileModalProps) => {
    const handleSave = () => {
        saveProfile();
        onClose();
    }

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-whatsapp-bg">
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-glass-border">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-whatsapp-green text-lg font-Outfit">Cancel</Text>
                    </TouchableOpacity>

                    <Text className="text-lg font-bold text-white font-Outfit">Edit Profile</Text>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isUpdating}
                        className={`${isUpdating ? "opacity-50" : ""}`}
                    >
                        {isUpdating ? (
                            <ActivityIndicator size="small" color="#25D366" />
                        ) : (
                            <Text className="text-whatsapp-green text-lg font-bold font-Outfit">Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="space-y-6">
                    <View>
                        <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-2 font-Outfit">First Name</Text>
                        <TextInput
                            className="bg-glass-bg border border-glass-border rounded-2xl p-4 text-white text-base font-Outfit"
                            value={formData.firstName}
                            onChangeText={(text) => updateFormField("firstName", text)}
                            placeholder="Your first name"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                        />
                    </View>

                    <View>
                        <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-2 font-Outfit">Last Name</Text>
                        <TextInput
                            className="bg-glass-bg border border-glass-border rounded-2xl p-4 text-white text-base font-Outfit"
                            value={formData.lastName}
                            onChangeText={(text) => updateFormField("lastName", text)}
                            placeholder="Your last name"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                        />
                    </View>

                    <View>
                        <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-2 font-Outfit">Bio</Text>
                        <TextInput
                            className="bg-glass-bg border border-glass-border rounded-2xl p-4 text-white text-base font-Outfit"
                            value={formData.bio}
                            onChangeText={(text) => updateFormField("bio", text)}
                            placeholder="Tell us about yourself"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View>
                        <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-2 font-Outfit">Location</Text>
                        <TextInput
                            className="bg-glass-bg border border-glass-border rounded-2xl p-4 text-white text-base font-Outfit"
                            value={formData.location}
                            onChangeText={(text) => updateFormField("location", text)}
                            placeholder="Where are you located?"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                        />
                    </View>
                </View>
            </ScrollView>
            </View>
        </Modal>
    );
}
export default EditProfileModal