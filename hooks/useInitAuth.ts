// hooks/useInitAuth.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLocale } from "@/store/languageSlice";
import { englishLocale } from "@/localization/config";
import { setLoading, setSession } from "@/store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useInitAuth = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const checkLoginStatus = async () => {
			dispatch(setLoading(true));
			const value = await AsyncStorage.getItem("session");
			if (value === "true") {
				dispatch(setSession(true));
			}
			dispatch(setLoading(false));
			const culture = await AsyncStorage.getItem("culture");
			dispatch(updateLocale(culture || englishLocale));
		};

		checkLoginStatus();
	}, []);
};
