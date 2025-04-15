import PublicAuthRoute from "@/components/PublicAuthRoute";
import { Stack } from "expo-router";

const LoginLayout = () => {
	return (
		<PublicAuthRoute>
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
		</PublicAuthRoute>
	);
};

export default LoginLayout;
