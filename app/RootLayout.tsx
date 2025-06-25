/**
 * Root Layout
 */
import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

const RootLayout = () => {
	const [appState, setAppState] = useState(AppState.currentState);
	const { session } = useAuth();

	useEffect(() => {
		if (Platform.OS === "web") return;
		const handleAppStateChange = (nextAppState: any) => {
			if (
				appState.match(/inactive|background/) &&
				nextAppState === "active"
			) {
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
				}}
			/>
			<Stack.Protected guard={!session}>
				<Stack.Screen
					name="(auth)"
					options={{
						headerShown: false,
						animation: "slide_from_right",
					}}
				/>
			</Stack.Protected>
			<Stack.Protected guard={!!session}>
				<Stack.Screen
					name="dashboard"
					options={{
						headerShown: false,
						animation: "simple_push",
					}}
				/>
			</Stack.Protected>

			<Stack.Screen name="+not-found" />
		</Stack>
	);
};
export default RootLayout;
