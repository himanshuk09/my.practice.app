import React, { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { useDispatch, useSelector, useStore } from "react-redux";

import { BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setInitialState } from "@/store/authSlice";
import { updateLocale } from "@/store/languageSlice";
import { closeDrawer } from "@/store/drawerSlice";
import { activeLoading } from "@/store/navigationSlice";

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

  const store = useStore();

  const [drawerOpen, SetDrawerOpen] = useState(false);
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
      const state: any = store.getState();
      const isDrawerOpen = state?.drawer?.isDrawerOpen;

      if (isDrawerOpen) {
        dispatch(closeDrawer());
        return true;
      }
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

      if (
        [
          "/dashboard/(tabs)/prices",
          "/dashboard/(tabs)/pfc",
          "/dashboard/(tabs)/loaddata",
          "/dashboard/(tabs)/signals",
          "/dashboard/(tabs)/portfolio",
        ].includes(currentPath)
      ) {
        dispatch(activeLoading());
        setTimeout(() => router.replace("/dashboard"));
        return true;
      }
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

  return children;
};

export default NavigationWatcher;
