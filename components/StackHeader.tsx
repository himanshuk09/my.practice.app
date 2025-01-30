import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { i18n } from "@/localization/localConfig";
import { useDispatch } from "react-redux";
import { activeLoading } from "@/store/navigationSlice";
import { useRouter } from "expo-router";

const StackHeader = ({ navigation, title }: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
    return (
        <View className="bg-chartHeaderBg px-4 items-center justify-start py-6 flex-row h-20">
            <TouchableOpacity
                onPress={() => {
                    router.back();
                    // dispatch(activeLoading());
                    // navigation.goBack();
                    if (Platform.OS === "web") {
                        window.history.back();
                    }
                }}
                className="w-7 ml-3"
            >
                <MaterialIcons name="arrow-back" size={27} color="#9a9b9f" />
            </TouchableOpacity>
            <Text className="ml-2 font-semibold text-xl text-chartText">
                {i18n.t(title)}
            </Text>
        </View>
    );
};

export default StackHeader;
