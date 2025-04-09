import React, { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useRouter, useSegments } from "expo-router";

import { closeDrawer } from "@/store/drawerSlice";
import { activeLoading } from "@/store/navigationSlice";
import { RootState } from "@/store/store";

import { useAuth } from "@/hooks/useAuth";

type NavigationWatcherProps = {
	children: React.ReactNode;
};

const NavigationWatcher: React.FC<NavigationWatcherProps> = ({ children }) => {
	const store = useStore();
	const router = useRouter();
	const { session } = useAuth();
	const dispatch = useDispatch();
	const segments = useSegments();
	const currentPath = "/" + segments.join("/");
	const history = useSelector(
		(state: RootState) => state.navigation.history
	);

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
