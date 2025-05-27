import React, { useEffect } from "react";
import { closeDrawer } from "@/store/drawerSlice";
import { BackHandler, TextStyle } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { useRouter, useSegments } from "expo-router";
import { activeLoading } from "@/store/navigationSlice";
import CustomAlert from "@/components/CustomAlert";

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
	const dispatch = useDispatch();
	const segments = useSegments();
	const currentPath = "/" + segments.join("/");
	const showAlert = async () => {
		CustomAlert({
			title: "exit_app",
			description: "exit_msg",
			showCancelButton: true,
			icon: "question",
			iconColor: "#e31837",
			onConfirm() {
				BackHandler.exitApp();
			},
		});
		return true;
	};

	useEffect(() => {
		const backAction = () => {
			const state: any = store.getState();
			const isDrawerOpen = state?.drawer?.isDrawerOpen;

			// Handle drawer close first
			if (isDrawerOpen) {
				dispatch(closeDrawer());
				return true;
			}

			// Handle specific route cases
			switch (currentPath) {
				case "/dashboard":
					showAlert();
					return true;

				case "/(auth)/forgot-password":
					router.replace("/(auth)/login");
					return true;
				case "/(auth)/login":
					showAlert();
					return true;
				default:
					// Handle dashboard paths
					if (dashboardPaths.includes(currentPath)) {
						dispatch(activeLoading());
						router.replace("/dashboard");
						return true;
					}

					// Handle general back navigation
					if (!router.canGoBack()) {
						BackHandler.exitApp();
						return true;
					}

					// dispatch(activeLoading());
					router.back();
					return true;
			}
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => backHandler.remove();
	}, [currentPath, dispatch, router]);
	return children;
};

export default NavigationWatcher;
