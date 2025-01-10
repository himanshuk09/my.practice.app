import Header from "@/components/MainHeader";
import { i18n } from "@/languageKeys/i18nConfig";
import { RootState } from "@/store/store";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useSelector } from "react-redux";

const LoaddataLayout = () => {
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    return (
        <Stack>
            <Stack.Screen
                name="imprint"
                options={{
                    headerShown: true,
                    animation: "slide_from_right",
                    animationDuration: 4000,
                    header: ({ navigation }) => (
                        <Header navigation={navigation} />
                    ),
                }}
            />
            <Stack.Screen
                name="privacypolicy"
                options={{
                    headerShown: true,
                    animation: "slide_from_right",
                    animationDuration: 4000,
                    header: ({ navigation }) => (
                        <Header navigation={navigation} />
                    ),
                }}
            />
            <Stack.Screen
                name="tc"
                options={{
                    headerShown: true,
                    animation: "slide_from_right",
                    animationDuration: 4000,
                    header: ({ navigation }) => (
                        <Header navigation={navigation} />
                    ),
                }}
            />
        </Stack>
    );
};
export default LoaddataLayout;
