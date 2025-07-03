/**
 *  Auth Layout
 */
import { Stack } from "expo-router";

const AuthLayout = () => {
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
				name="login"
				options={{
					headerShown: false,
					animation: "ios_from_left",
					animationTypeForReplace: "push",
				}}
			/>
			<Stack.Screen
				name="forgot-password"
				options={{
					headerShown: false,
					animation: "ios_from_right",
				}}
			/>
		</Stack>
	);
};

export default AuthLayout;
