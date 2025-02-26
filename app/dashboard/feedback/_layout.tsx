import Header from "@/components/MainHeader";
import { Stack } from "expo-router";

const LoaddataLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="contact"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => (
						<Header navigation={navigation} />
					),
				}}
			/>
			<Stack.Screen
				name="rate"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => (
						<Header navigation={navigation} />
					),
				}}
			/>
		</Stack>
	);
};
export default LoaddataLayout;
