import { i18n } from "@/languageKeys/i18nConfig";
import { RootState } from "@/store/store";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useSelector } from "react-redux";
const PFCLayout = () => {
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{ headerShown: false, animation: "slide_from_left" }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: Platform.OS === "web" ? true : !isLandscape,
                    animation: "slide_from_right",
                    header: ({ navigation }) => (
                        <View className="bg-chartHeaderBg px-4 items-center justify-start py-6 flex-row h-20">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="w-9"
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={30}
                                    color="#9a9b9f"
                                />
                            </TouchableOpacity>
                            <Text className="ml-4 font-semibold text-xl text-chartText">
                                {i18n.t("PFC_Details")}
                            </Text>
                        </View>
                    ),
                }}
            />
        </Stack>
    );
};
export default PFCLayout;
