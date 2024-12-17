import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import "../global.css";
import { useDispatch, useSelector } from "react-redux";
import { setInitialState } from "@/store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateLocale } from "@/store/languageSlice";

export default function RootLayout() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state?.auth?.value);
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useRef(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check login status from AsyncStorage
        const loggedIn = await AsyncStorage.getItem("isLoggedIn");
        const storedLanguage = await AsyncStorage.getItem("languagePreference");
        if (loggedIn === "true") {
          dispatch(setInitialState(true));
          dispatch(updateLocale(storedLanguage || "en"));
        } else {
          dispatch(setInitialState(false));
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    initializeApp();
    return () => {
      isMounted.current = false; // Cleanup for component unmount
    };
  }, [dispatch]);
  const getLanguagePreference = async () => {
    const storedLanguage = await AsyncStorage.getItem("languagePreference");
    dispatch(updateLocale(storedLanguage || "en"));
  };
  useEffect(() => {
    if (
      !isLoggedIn &&
      pathname !== "/" &&
      pathname !== "/login" &&
      pathname !== "/login/forgotpassword"
    ) {
      router.replace("/");
    } else if (
      isLoggedIn &&
      (pathname === "/" ||
        pathname === "/login" ||
        pathname === "/login/forgotpassword")
    ) {
      getLanguagePreference();
      router.replace("/dashboard");
    }
  }, [isLoggedIn, pathname, router]);

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
            headerShown: false,
            animation: "slide_from_left",
            animationDuration: 1000,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 1000,
          }}
        />

        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
            animationDuration: 2000,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
