import React, { useEffect, useState } from "react";
import { BackHandler, Alert } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setInitialState } from "@/store/authSlice";
import { updateLocale } from "@/store/languageSlice";
import { closeDrawer } from "@/store/drawerSlice";
import { activeLoading } from "@/store/navigationSlice";
import { RootState } from "@/store/store";
import useNetworkStatus from "@/hooks/useNetworkStatus";

type NavigationWatcherProps = {
	children: React.ReactNode;
};

const NavigationWatcher: React.FC<NavigationWatcherProps> = ({ children }) => {
	const store = useStore();
	const router = useRouter();
	const dispatch = useDispatch();
	const segments = useSegments();
	const isOnline = useNetworkStatus();
	const currentPath = "/" + segments.join("/");
	const history = useSelector(
		(state: RootState) => state.navigation.history
	);
	const [shouldExitApp, setShouldExitApp] = useState(false);
	// Fetch user login status and initialize app
	const fetchUserLoginStatus = async () => {
		try {
			const value = await AsyncStorage.getItem("isLoggedIn");
			const language =
				await AsyncStorage.getItem("languagePreference");
			setShouldExitApp(value === "true");
			dispatch(updateLocale(language || "en"));
			if (value === "true") {
				dispatch(setInitialState(true));
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

			// Handle exit confirmation on /dashboard
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
				return true;
			}

			// Handle navigation for other paths
			if (currentPath === "/login/forgotpassword") {
				router.replace("/login");
				return true;
			}
			if (currentPath === "/login") {
				BackHandler.exitApp();
				return true;
			}

			dispatch(activeLoading());

			// Handle specific paths within dashboard
			const dashboardPaths = [
				"/dashboard/(tabs)/prices",
				"/dashboard/(tabs)/pfc",
				"/dashboard/(tabs)/loaddata",
				"/dashboard/(tabs)/signals",
				"/dashboard/(tabs)/portfolio",
			];

			if (dashboardPaths.includes(currentPath)) {
				setTimeout(() => router.replace("/dashboard"));
				return true;
			}

			// // Only go back if there is a valid previous screen
			// if (history.length !== 0) {
			// 	router.back();
			// } else {
			// 	router.replace("/dashboard"); // Or navigate to a default screen if no history
			// }
			router.back();
			return true;
		};

		fetchUserLoginStatus();
		// checkInternetConnection();
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => {
			backHandler.remove();
		};
	}, [currentPath, history, shouldExitApp, dispatch, router, segments]);

	return children;
};

export default NavigationWatcher;
