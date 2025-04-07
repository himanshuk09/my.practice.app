import StackHeader from "@/components/StackHeader";
import { RootState } from "@/store/store";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

const LoaddataLayout = () => {
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
					headerShown:
						Platform.OS === "web" ? true : !isLandscape,
					animation: "fade",
					header: ({ navigation }) => (
						<StackHeader
							navigation={navigation}
							title={"Load_Data_Details"}
						/>
					),
				}}
			/>
		</Stack>
	);
};
export default LoaddataLayout;
