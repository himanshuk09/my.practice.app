import "react-native-reanimated";
import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/MainHeader";
import { StatusBar } from "react-native";

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
                        animationDuration: 4000,
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
                        animationDuration: 5000,
                    }}
                />
                <Stack.Screen
                    name="(top-tabs)"
                    options={{
                        headerShown: true,
                        animation: "fade",
                        animationDuration: 500,
                        header: ({ navigation }) => (
                            <Header navigation={navigation} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        animation: "slide_from_right",
                        animationDuration: 500,
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
