import "../global.css";
import "react-native-reanimated";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootLayout = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [isAuth, setIsAuth] = useState<boolean>();
	const [appState, setAppState] = useState(AppState.currentState);
	// useEffect(() => {
	//     const handleAppStateChange = (nextAppState: any) => {
	//         if (
	//             appState.match(/inactive|background/) &&
	//             nextAppState === "active"
	//         ) {
	//             dispatch(activeLoading());
	//             setTimeout(() => {
	//                 dispatch(inActiveLoading());
	//                 router.push("/dashboard" as Href);
	//             }, 2000);
	//         }
	//         setAppState(nextAppState);
	//     };
	//     const subscription = AppState.addEventListener(
	//         "change",
	//         handleAppStateChange
	//     );
	//     return () => {
	//         subscription.remove();
	//     };
	// }, [appState]);
	useEffect(() => {
		const checkAuth = async () => {
			const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
			setIsAuth(isLoggedIn === "true");
		};
		checkAuth();
	}, []);

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
