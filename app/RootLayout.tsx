import { Href, Stack, useRouter } from "expo-router";

import "react-native-reanimated";
import "../global.css";
import { AppState } from "react-native";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const RootLayout = () => {
    const [appState, setAppState] = useState(AppState.currentState);
    const dispatch = useDispatch();
    const router = useRouter();
    // useEffect(() => {
    //     const handleAppStateChange = (nextAppState: any) => {
    //         if (
    //             appState.match(/inactive|background/) &&
    //             nextAppState === "active"
    //         ) {
    //             dispatch(activeLoading());
    //             setTimeout(() => {
    //                 dispatch(inActiveLoading());
    //                 router.push("/dashboard" as Href);
    //             }, 2000);
    //         }
    //         setAppState(nextAppState);
    //     };
    //     const subscription = AppState.addEventListener(
    //         "change",
    //         handleAppStateChange
    //     );
    //     return () => {
    //         subscription.remove();
    //     };
    // }, [appState]);
    return (
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
                    headerShown: false,
                    animation: "slide_from_left",
                    animationDuration: 500,
                }}
            />
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 4000,
                }}
            />
            <Stack.Screen
                name="dashboard"
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                    animationDuration: 4000,
                }}
            />

            <Stack.Screen name="+not-found" />
        </Stack>
    );
};
export default RootLayout;
