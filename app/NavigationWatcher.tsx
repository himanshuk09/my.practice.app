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

type NavigationWatcherProps = {
  children: React.ReactNode;
};

const NavigationWatcher: React.FC<NavigationWatcherProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const history = useSelector((state: any) => state.navigation.history);
  const segments = useSegments();
  const [shouldExitApp, setShouldExitApp] = useState(false);

  // Fetch user login status
  const fetchUserLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("isLoggedIn");
      setShouldExitApp(value === "true");
    } catch (error) {
      console.error("Error fetching user login status:", error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      const currentPath = "/" + segments.join("/");
      if (currentPath === "/dashboard") {
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
      if (currentPath.startsWith("/dashboard/(top-tabs)/")) {
        dispatch(activeLoading());
        setTimeout(() => router.replace("/dashboard"));
        // Navigate to `/dashboard`
        return true;
      }

      // Standard back navigation
      if (history.length > 1) {
        dispatch(removeLastRoute());
        dispatch(activeLoading());
        setTimeout(() => {
          router.replace(history[history.length - 2]);
        }); // Navigate to the previous route
        return true;
      }

      return false; // Allow default behavior if no other condition matches
    };
    fetchUserLoginStatus();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [history, router, dispatch, segments, shouldExitApp]);

  useEffect(() => {
    const currentPath = "/" + segments.join("/");
    dispatch(addRouteToHistory(currentPath));
  }, [segments, dispatch]);

  return children;
};

export default NavigationWatcher;
