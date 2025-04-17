import StackHeader from "@/components/StackHeader";
import { RootState } from "@/store/store";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

const SignalsLayout = () => {
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
					animation: "slide_from_left",
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					headerShown: Platform.OS === "web" ? true : !isLandscape,
					animation: "slide_from_right",
					header: ({ navigation }) => (
						<StackHeader
							navigation={navigation}
							title={"Signals_Details"}
						/>
					),
				}}
			/>
		</Stack>
	);
};
export default SignalsLayout;
