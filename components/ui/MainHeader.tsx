import React, { useState } from "react";
import Logo from "@/components/svg/Logo";
import { useDispatch } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { toggleDrawer } from "@/store/drawerSlice";
import { useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { SafeAreaView, View, TouchableOpacity, Platform } from "react-native";

const Header = React.memo(() => {
	const dispatch = useDispatch();
	const router = useRouter();
	const segment = useSegments().join("/");
	const [headerPress, setHeaderPress] = useState(false);
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView
			style={{ backgroundColor: "white", marginTop: insets.top }}
		>
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
					disabled={headerPress}
					onPress={() => {
						if (headerPress) return; // Prevent double press
						setHeaderPress(true);
						dispatch(activeLoading());

						setTimeout(() => {
							dispatch(inActiveLoading());
						}, 1000);

						if (segment === "dashboard") {
							setHeaderPress(false);
							return;
						}

						// Navigate after a slight delay, ensuring loading starts first
						setTimeout(() => {
							router.push("/dashboard");
							setHeaderPress(false);
						});
					}}
				>
					<Logo />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
});
export default Header;
