import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setSession } from "@/store/authSlice";
import { updateLocale } from "@/store/languageSlice";
import { englishLocale } from "@/localization/config";

const AuthInitializeWrapper = ({ children }: { children: React.ReactNode }) => {
	const [isReady, setIsReady] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const initAuth = async () => {
			try {
				// Assume "token" and "session" are stored in AsyncStorage
				const token = await AsyncStorage.getItem("token");
				const session = await AsyncStorage.getItem("session");
				const culture = await AsyncStorage.getItem("culture");

				if (token && session) {
					dispatch(setSession(true));
				} else {
					dispatch(setSession(false));
				}
				dispatch(updateLocale(culture || englishLocale));
			} catch (error) {
				console.error("Auth init error:", error);
				dispatch(setSession(false));
			} finally {
				setIsReady(true);
				await SplashScreen.hideAsync();
			}
		};

		initAuth();
	}, []);

	if (!isReady) return null;

	return <>{children}</>;
};

export default AuthInitializeWrapper;
