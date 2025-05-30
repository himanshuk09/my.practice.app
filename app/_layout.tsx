import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import RootLayout from "@/app/RootLayout";
import * as SplashScreen from "expo-splash-screen";
import ToastProvider from "@/components/ToastProvider";
import AppLoader from "@/components/Wrapper/AppLoader";
import { AlertContainer } from "rn-custom-alert-prompt";
import * as ScreenOrientation from "expo-screen-orientation";
import UpdatesListener from "@/components/Wrapper/UpdatesListener";
import NetworkListener from "@/components/Wrapper/NetworkListener";
import NavigationWatcher from "@/components/Wrapper/NavigationWatcher";
import AuthInitializeWrapper from "@/components/Wrapper/AuthInitializeWrapper ";
import {
	cleanupNotificationListeners,
	initializeNotifications,
} from "@/components/services/notificationService";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
});

const Layout = () => {
	useEffect(() => {
		if (Platform.OS !== "web") {
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
			initializeNotifications();
		}

		return () => {
			if (Platform.OS !== "web") {
				ScreenOrientation.unlockAsync();
				cleanupNotificationListeners();
			}
		};
	}, []);

	return (
		<Provider store={store}>
			<AuthInitializeWrapper>
				<NavigationWatcher>
					<AppLoader>
						<NetworkListener />
						<UpdatesListener />
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
