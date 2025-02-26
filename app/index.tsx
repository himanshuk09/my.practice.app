import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
	const [isAuth, setIsAuth] = useState<boolean>();

	useEffect(() => {
		const checkAuth = async () => {
			const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
			setIsAuth(isLoggedIn === "true");
		};
		checkAuth();
	}, []);

	return isAuth ? (
		<Redirect href="/dashboard" />
	) : (
		<Redirect href="/login" />
	);
}
