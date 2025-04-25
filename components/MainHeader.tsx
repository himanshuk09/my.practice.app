import React from "react";
import { SafeAreaView, View, TouchableOpacity, Platform } from "react-native";
import Logo from "./SVG/Logo";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { toggleDrawer } from "@/store/drawerSlice";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

const Header = React.memo(({ navigation }: any) => {
	const dispatch = useDispatch();
	const router = useRouter();
	return (
		<SafeAreaView style={{ backgroundColor: "white" }}>
			<View
				style={{
					paddingHorizontal: 1,
					height: 80,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					borderBottomWidth: 0,
					// Platform-specific shadow removal
					...Platform.select({
						android: { elevation: 0 },
						ios: {
							shadowColor: "transparent",
							shadowOpacity: 0,
							shadowOffset: { width: 0, height: 0 },
						},
						default: {
							// Web
							boxShadow: "none",
						},
					}),
				}}
			>
				<TouchableOpacity
					onPress={() => dispatch(toggleDrawer())}
					style={{
						position: "absolute",
						left: 10,
						top: 10,
					}}
				>
					<Entypo name="menu" size={30} color="#9a9b9f" />
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						setTimeout(() => {
							router.replace("/dashboard");
						});
						dispatch(activeLoading());
						setTimeout(() => {
							dispatch(inActiveLoading());
						}, 2000);
					}}
				>
					<Logo />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
});
export default Header;
