import { Stack } from "expo-router";
import Header from "@/components/ui/MainHeader";

const FeedBackLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="contact"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => <Header />,
				}}
			/>
			<Stack.Screen
				name="rate"
				options={{
					headerShown: true,
					animation: "slide_from_right",
					header: ({ navigation }) => <Header />,
				}}
			/>
		</Stack>
	);
};
export default FeedBackLayout;
