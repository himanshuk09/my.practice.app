import React, { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  activeLoading,
  addRouteToHistory,
  removeLastRoute,
} from "@/store/navigationSlice";
import { BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setInitialState } from "@/store/authSlice";
import { updateLocale } from "@/store/languageSlice";

type NavigationWatcherProps = {
  children: React.ReactNode;
};

const NavigationWatcher: React.FC<NavigationWatcherProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const history = useSelector((state: any) => state.navigation.history);
  const segments = useSegments();
  const [shouldExitApp, setShouldExitApp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const currentPath = "/" + segments.join("/");

  // Fetch user login status and initialize app
  const fetchUserLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("isLoggedIn");
      const language = await AsyncStorage.getItem("languagePreference");
      setShouldExitApp(value === "true");
      setIsLoggedIn(value === "true");
      if (value === "true") {
        dispatch(setInitialState(true));
        dispatch(updateLocale(language || "en"));
      } else {
        dispatch(setInitialState(false));
      }
    } catch (error) {
      console.error("Error fetching user login status:", error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      console.log("shouldExitApp", shouldExitApp, currentPath);

      if (currentPath === "/(drawer)/dashboard") {
        console.log("match", currentPath);

        if (shouldExitApp) {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "OK",
                onPress: () => BackHandler.exitApp(),
                style: "destructive",
              },
            ],
            { cancelable: true }
          );
        } else {
          router.back();
        }
        return true; // Prevent default back behavior
      }

      // Handle `/dashboard/(top-tabs)/...` back press
      // if (currentPath.startsWith("/dashboard/(top-tabs)/")) {
      //   dispatch(activeLoading());
      //   setTimeout(() => router.replace("/dashboard"));
      //   // Navigate to `/dashboard`
      //   return true;
      // }

      // // Standard back navigation
      // if (history.length > 1) {
      //   dispatch(removeLastRoute());
      //   dispatch(activeLoading());
      //   setTimeout(() => {
      //     router.replace(history[history.length - 2]);
      //   }); // Navigate to the previous route
      //   return true;
      // }

      return false;
    };
    fetchUserLoginStatus();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      setIsMounted(false);
    };
  }, [currentPath, history, shouldExitApp, dispatch, router, segments]);

  useEffect(() => {
    if (!isMounted) return;
    if (
      !isLoggedIn &&
      !["/", "/login", "/login/forgotpassword"].includes(currentPath)
    ) {
      router.replace("/"); // Redirect to login if not logged in
    } else if (
      isLoggedIn &&
      ["/", "/login", "/login/forgotpassword"].includes(currentPath)
    ) {
      router.replace("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [isLoggedIn, currentPath, router, isMounted]);
  return children;
};

export default NavigationWatcher;
