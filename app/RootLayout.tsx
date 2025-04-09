import "../global.css";
import "react-native-reanimated";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { Href, Stack, useRouter } from "expo-router";
import { useInitAuth } from "@/hooks/useInitAuth";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const RootLayout = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [appState, setAppState] = useState(AppState.currentState);
	useEffect(() => {
		if (Platform.OS === "web") return; // ❌ Don't apply on web
		const handleAppStateChange = (nextAppState: any) => {
			if (
				appState.match(/inactive|background/) &&
				nextAppState === "active"
			) {
				dispatch(activeLoading());
				setTimeout(() => {
					dispatch(inActiveLoading());
					// router.push("/dashboard" as Href);
				}, 1000);
			}
			setAppState(nextAppState);
		};
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange
		);
		return () => {
			subscription.remove();
		};
	}, [appState]);

	useInitAuth();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				gestureDirection: "vertical",
				contentStyle: { backgroundColor: "white" },
				statusBarAnimation: "slide",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					animation: "slide_from_left",
					animationDuration: 500,
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					headerShown: false,
					animation: "slide_from_right",
					animationDuration: 4000,
				}}
			/>
			<Stack.Screen
				name="dashboard"
				options={{
					headerShown: false,
					animation: "slide_from_bottom",
					animationDuration: 4000,
				}}
			/>

			<Stack.Screen name="+not-found" />
		</Stack>
	);
};
export default RootLayout;
