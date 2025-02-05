import React, { useEffect, useState } from "react";
import RootLayout from "./RootLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppLoader from "./AppLoader";
import NavigationWatcher from "./NavigationWatcher";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import Drawer from "@/components/Drawer";
import SwipeDetectionWrapper from "./SwipeDetectionWrapper";
import toastConfig from "@/components/ToastConfig";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";
import { Href, usePathname, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

const Layout = () => {
    const segment = useSegments();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let timer = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 2000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (Platform.OS !== "web") {
            // Lock orientation to portrait for mobile platforms
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
        }
        return () => {
            if (Platform.OS !== "web") {
                // Unlock orientation when leaving the screen (optional)
                ScreenOrientation.unlockAsync();
            }
        };
    }, []);
    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            if (isLoggedIn !== "true") {
                router.replace("/" as Href);
            }
        };

        if (
            pathname !== "/" &&
            pathname !== "/login" &&
            pathname !== "/login/forgotpassword"
        ) {
            checkAuth();
        }
    }, [pathname]);
    return (
        <Provider store={store}>
            <Drawer drawerWidth={290} />
            <SwipeDetectionWrapper>
                <NavigationWatcher>
                    <AppLoader>
                        <RootLayout />
                        <Toast config={toastConfig} />
                    </AppLoader>
                </NavigationWatcher>
            </SwipeDetectionWrapper>
        </Provider>
    );
};

export default Layout;
