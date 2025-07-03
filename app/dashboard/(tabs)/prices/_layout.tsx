import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import StackHeader from "@/components/ui/StackHeader";

const PricesLayout = () => {
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
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
					headerShown: Platform.OS === "web" ? true : !isLandscape,
					animation: "fade",
					header: ({ navigation }) => (
						<StackHeader
							navigation={navigation}
							title={"Prices_Details"}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					headerShown: true,
					title: "Settings Prices",
					animation: "fade",
					headerBackButtonDisplayMode: "minimal",
					headerBackVisible: true,
					headerStyle: {
						backgroundColor: "gray",
					},
					headerTintColor: "#fff",
					headerBackButtonMenuEnabled: true,
					header: ({ navigation }) => (
						<StackHeader
							navigation={navigation}
							title={"Prices_Setting"}
						/>
					),
				}}
			/>
		</Stack>
	);
};
export default PricesLayout;
