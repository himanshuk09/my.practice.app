import React, { useEffect } from "react";
import { RootState } from "@/store/store";
import { BackHandler } from "react-native";
import { AUTHKEYS, PERMISSIONKEYS, ROUTEKEYS } from "@/utils/messages";
import { closeDrawer } from "@/store/drawerSlice";
import CustomAlert from "@/components/CustomAlert";
import { setOrientation } from "@/store/chartSlice";
import { useRouter, useSegments } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector, useStore } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

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
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	const showAlert = async () => {
		CustomAlert({
			title: PERMISSIONKEYS.EXIT_APP,
			description: PERMISSIONKEYS.EXIT_MESSAGE,
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
			if (isLandscape) {
				ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.PORTRAIT
				);
				dispatch(activeLoading());
				dispatch(setOrientation(false));
				setTimeout(() => {
					dispatch(inActiveLoading());
				}, 2000);
				return true;
			}

			// Handle specific route cases
			switch (currentPath) {
				case ROUTEKEYS.DASHBOARD:
					showAlert();
					return true;

				case ROUTEKEYS.FORGOT_PASSWORD:
					router.replace(ROUTEKEYS.LOGIN);
					return true;
				case ROUTEKEYS.LOGIN:
					showAlert();
					return true;
				default:
					// Handle dashboard paths
					if (dashboardPaths.includes(currentPath)) {
						dispatch(activeLoading());
						router.replace(ROUTEKEYS.DASHBOARD);
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
	}, [currentPath, dispatch, router, isLandscape]);
	return children;
};

export default NavigationWatcher;
