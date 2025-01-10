import { i18n } from "@/languageKeys/i18nConfig";
import { RootState } from "@/store/store";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useSelector } from "react-redux";

const PricesLayout = () => {
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
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: Platform.OS === "web" ? true : !isLandscape,
                    animation: "slide_from_right",
                    header: ({ navigation }) => (
                        <View className="bg-[#ebebeb] px-4 items-center justify-start py-6 flex-row h-20">
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                    if (Platform.OS === "web") {
                                        window.history.back();
                                    }
                                }}
                                className="w-9"
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={30}
                                    color="#9b9b9b"
                                />
                            </TouchableOpacity>
                            <Text className="ml-4 font-medium text-2xl text-[#9b9b9b]">
                                Prices Details
                            </Text>
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    title: "Settings Prices",
                    animation: "slide_from_right",
                    headerBackButtonDisplayMode: "minimal",
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: "gray",
                    },
                    headerTintColor: "#fff",
                    headerBackButtonMenuEnabled: true,
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
                                {i18n.t("Prices_Setting")}
                            </Text>
                        </View>
                    ),
                }}
            />
        </Stack>
    );
};
export default PricesLayout;
