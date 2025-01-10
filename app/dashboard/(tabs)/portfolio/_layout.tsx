import { i18n } from "@/languageKeys/i18nConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
const PortfolioLayout = () => {
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
                name="portfolio-overview"
                options={{
                    headerShown: true,
                    animation: "slide_from_right",
                    header: ({ navigation }) => (
                        <View className="bg-chartHeaderBg px-4 items-center justify-start py-6 flex-row h-20">
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
                                    color="#9a9b9f"
                                />
                            </TouchableOpacity>
                            <Text className="ml-4 font-semibold text-xl text-chartText">
                                Portfolio Overview
                            </Text>
                        </View>
                    ),
                }}
            />
        </Stack>
    );
};

export default PortfolioLayout;
