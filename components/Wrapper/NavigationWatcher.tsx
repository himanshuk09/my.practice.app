import React, { useEffect } from "react";
import { RootState } from "@/store/store";
import { BackHandler } from "react-native";
import { PERMISSIONKEYS, ROUTEKEYS } from "@/utils/messages";
import { closeDrawer } from "@/store/drawerSlice";
import CustomAlert from "@/components/CustomAlert";
import { setOrientation } from "@/store/chartSlice";
import { Href, useRouter, useSegments } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDispatch, useSelector, useStore } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

type NavigationWatcherProps = {
	children: React.ReactNode;
};
// Handle specific paths within dashboard
const dashboardPaths: string[] = [
	ROUTEKEYS.PRICES,
	ROUTEKEYS.PFC,
	ROUTEKEYS.LOADDATA,
	ROUTEKEYS.SIGNALS,
	ROUTEKEYS.PORTFOLIO,
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
				dispatch(activeLoading());
				ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.PORTRAIT
				)
					.then(() => {
						dispatch(setOrientation(false));
					})
					.finally(() => {
						dispatch(inActiveLoading());
					});
				return true;
			}

			if (dashboardPaths.includes(currentPath)) {
				dispatch(activeLoading());
				router.dismissTo(ROUTEKEYS.DASHBOARD);
				return true;
			}

			// Handle general back navigation
			if (!router.canGoBack()) {
				showAlert();
				return true;
			}

			router.back();
			return true;
			// }
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => backHandler.remove();
	}, [currentPath, isLandscape]);
	return children;
};

export default NavigationWatcher;
