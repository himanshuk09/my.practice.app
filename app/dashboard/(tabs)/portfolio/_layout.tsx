import { Stack } from "expo-router";
import StackHeader from "@/components/ui/StackHeader";

const PortfolioLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					animation: "ios_from_left",
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					headerShown: true,
					animation: "fade",
					header: ({ navigation }) => (
						<StackHeader
							navigation={navigation}
							title={"portfolio_overview"}
						/>
					),
				}}
			/>
		</Stack>
	);
};

export default PortfolioLayout;
