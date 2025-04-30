import React, { useEffect } from "react";
import { closeDrawer } from "@/store/drawerSlice";
import { BackHandler, Alert } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { useRouter, useSegments } from "expo-router";
import { activeLoading } from "@/store/navigationSlice";

import { useAuth } from "@/hooks/useAuth";

type NavigationWatcherProps = {
	children: React.ReactNode;
};
// Handle specific paths within dashboard
const dashboardPaths = [
	"/dashboard/(tabs)/prices",
	"/dashboard/(tabs)/pfc",
	"/dashboard/(tabs)/loaddata",
	"/dashboard/(tabs)/signals",
	"/dashboard/(tabs)/portfolio",
];

const NavigationWatcher: React.FC<NavigationWatcherProps> = ({ children }) => {
	const store = useStore();
	const router = useRouter();
	const { session } = useAuth();
	const dispatch = useDispatch();
	const segments = useSegments();
	const currentPath = "/" + segments.join("/");

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
				if (session) {
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
			if (currentPath === "/(auth)/forgot-password") {
				router.replace("/(auth)/login");
				return true;
			}
			if (!router.canGoBack()) {
				BackHandler.exitApp();
				return true;
			}
			dispatch(activeLoading());

			if (dashboardPaths.includes(currentPath)) {
				setTimeout(() => router.replace("/dashboard"));
				return true;
			}

			router.back();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => {
			backHandler.remove();
		};
	}, [currentPath, session, dispatch, router, segments]);

	return children;
};

export default NavigationWatcher;
