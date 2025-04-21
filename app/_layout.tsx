import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import AppLoader from "@/app/AppLoader";
import React, { useEffect } from "react";
import RootLayout from "@/app/RootLayout";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import toastConfig from "@/components/ToastConfig";
import NavigationWatcher from "@/app/NavigationWatcher";
import * as ScreenOrientation from "expo-screen-orientation";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const Layout = () => {
	useEffect(() => {
		let timer = setTimeout(() => {
			SplashScreen.hideAsync();
		}, 2000);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	useEffect(() => {
		if (Platform.OS !== "web") {
			// Lock orientation to portrait for mobile platforms
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
		}
		return () => {
			if (Platform.OS !== "web") {
				// Unlock orientation when leaving the screen (optional)
				ScreenOrientation.unlockAsync();
			}
		};
	}, []);
	return (
		<Provider store={store}>
			<NavigationWatcher>
				<AppLoader>
					<RootLayout />
					<Toast config={toastConfig} />
				</AppLoader>
			</NavigationWatcher>
		</Provider>
	);
};

export default Layout;
