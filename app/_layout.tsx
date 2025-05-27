import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import AppLoader from "@/components/Wrapper/AppLoader";
import React, { useEffect } from "react";
import RootLayout from "@/app/RootLayout";
import NetworkListener from "@/components/Wrapper/NetworkListener";
import * as SplashScreen from "expo-splash-screen";
import NavigationWatcher from "@/components/Wrapper/NavigationWatcher";
import * as ScreenOrientation from "expo-screen-orientation";
import { AlertContainer } from "rn-custom-alert-prompt";
import ToastProvider from "@/components/ToastProvider";
import AuthInitializeWrapper from "@/components/Wrapper/AuthInitializeWrapper ";
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
});

const Layout = () => {
	// useEffect(() => {
	// 	let timer: NodeJS.Timeout | number;

	// 	timer = setTimeout(() => {
	// 		SplashScreen.hideAsync();
	// 	}, 2000);

	// 	if (Platform.OS !== "web") {
	// 		ScreenOrientation.lockAsync(
	// 			ScreenOrientation.OrientationLock.PORTRAIT_UP
	// 		);
	// 	}

	// 	return () => {
	// 		clearTimeout(timer);

	// 		if (Platform.OS !== "web") {
	// 			ScreenOrientation.unlockAsync();
	// 		}
	// 	};
	// }, []);
	useEffect(() => {
		if (Platform.OS !== "web") {
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
		}

		return () => {
			if (Platform.OS !== "web") {
				ScreenOrientation.unlockAsync();
			}
		};
	}, []);
	return (
		<Provider store={store}>
			<AuthInitializeWrapper>
				<NavigationWatcher>
					<AppLoader>
						<NetworkListener />
						<RootLayout />
						<AlertContainer
							animationType="fade"
							appearance="light"
							theme="ios"
						/>
						<ToastProvider />
					</AppLoader>
				</NavigationWatcher>
			</AuthInitializeWrapper>
		</Provider>
	);
};

export default Layout;
