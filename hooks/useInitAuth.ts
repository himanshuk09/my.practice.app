// hooks/useInitAuth.ts
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setLoading, setSession } from "@/store/authSlice";
import { updateLocale } from "@/store/languageSlice";

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
			dispatch(updateLocale(culture || "en"));
		};

		checkLoginStatus();
	}, []);
};
