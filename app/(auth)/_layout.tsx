// app/(auth)/_layout.tsx
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
					animation: "slide_from_left",
					animationTypeForReplace: "push",
				}}
			/>
			<Stack.Screen
				name="forgot-password"
				options={{
					headerShown: false,
					animation: "slide_from_right",
				}}
			/>
		</Stack>
	);
};

export default AuthLayout;
