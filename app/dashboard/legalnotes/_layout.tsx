import { Stack } from "expo-router";
import Header from "@/components/ui/MainHeader";

const LoaddataLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="imprint"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					animationDuration: 4000,
					header: ({ navigation }) => <Header />,
				}}
			/>
			<Stack.Screen
				name="privacypolicy"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => <Header />,
				}}
			/>
			<Stack.Screen
				name="tc"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => <Header />,
				}}
			/>
		</Stack>
	);
};
export default LoaddataLayout;
