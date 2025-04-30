import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import AppLoader from "@/app/AppLoader";
import React, { useEffect } from "react";
import RootLayout from "@/app/RootLayout";
import Toast from "react-native-toast-message";
import NetworkListener from "./NetworkListener";
import toastConfig from "@/components/ToastConfig";
import * as SplashScreen from "expo-splash-screen";
import NavigationWatcher from "@/app/NavigationWatcher";
import * as ScreenOrientation from "expo-screen-orientation";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const Layout = () => {
	useEffect(() => {
		let timer: NodeJS.Timeout;

		timer = setTimeout(() => {
			SplashScreen.hideAsync();
		}, 2000);

		if (Platform.OS !== "web") {
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
		}

		return () => {
			clearTimeout(timer);

			if (Platform.OS !== "web") {
				ScreenOrientation.unlockAsync();
			}
		};
	}, []);

	return (
		<Provider store={store}>
			<NavigationWatcher>
				<AppLoader>
					<NetworkListener />
					<RootLayout />
					<Toast config={toastConfig} />
				</AppLoader>
			</NavigationWatcher>
		</Provider>
	);
};

export default Layout;
