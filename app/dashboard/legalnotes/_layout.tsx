import { Stack } from "expo-router";
import Header from "@/components/ui/MainHeader";

const LegalNotesLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="imprint"
				options={{
					headerShown: true,
					animation: "ios_from_left",
					header: ({ navigation }) => <Header />,
				}}
			/>
			<Stack.Screen
				name="privacypolicy"
				options={{
					headerShown: true,
					animation: "ios_from_left",
					header: ({ navigation }) => <Header />,
				}}
			/>
			<Stack.Screen
				name="termscondition"
				options={{
					headerShown: true,
					animation: "ios_from_left",
					header: ({ navigation }) => <Header />,
				}}
			/>
		</Stack>
	);
};
export default LegalNotesLayout;
