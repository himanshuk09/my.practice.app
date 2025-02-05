import "react-native-reanimated";
import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/MainHeader";

const DashboardLayout = () => {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                    contentStyle: { backgroundColor: "white" },
                    statusBarAnimation: "slide",
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        animation: "slide_from_left",

                        header: ({ navigation }) => (
                            <Header navigation={navigation} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                        animation: "slide_from_right",
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        animation: "slide_from_right",

                        header: ({ navigation }) => (
                            <Header navigation={navigation} />
                        ),
                    }}
                />
            </Stack>
        </>
    );
};

export default DashboardLayout;
