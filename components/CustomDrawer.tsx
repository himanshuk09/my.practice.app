import React, { memo, useMemo, useRef, useState } from "react";
import {
	Text,
	TouchableOpacity,
	ScrollView,
	Animated,
	Easing,
	View,
	Alert,
	Platform,
} from "react-native";
import {
	MaterialIcons,
	FontAwesome,
	Ionicons,
	Feather,
	FontAwesome6,
} from "@expo/vector-icons";
import { Href, useRouter, useSegments } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/localization/config";
import { closeDrawer } from "@/store/drawerSlice";
import { RootState } from "@/store/store";
import { setOrientation } from "@/store/chartSlice";
import { useAuth } from "@/hooks/useAuth";
import { menuItems } from "@/utils/MenuItemlist";
import { activeLoading } from "@/store/navigationSlice";

// Helper Components
const Submenu = memo(
	({
		isVisible,
		children,
		height,
	}: {
		isVisible: boolean;
		children: React.ReactNode;
		height: number | any;
	}) => {
		const heightAnim = useRef(new Animated.Value(0)).current;
		const opacityAnim = useRef(new Animated.Value(0)).current;

		React.useEffect(() => {
			Animated.timing(heightAnim, {
				toValue: isVisible ? height : 0,
				duration: 0,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: false,
			}).start();

			Animated.timing(opacityAnim, {
				toValue: isVisible ? 1 : 0,
				duration: 0,
				useNativeDriver: false,
			}).start();
		}, [isVisible]);

		return (
			<Animated.View
				style={{
					height: heightAnim,
					opacity: opacityAnim,
					overflow: "hidden",
				}}
			>
				{children}
			</Animated.View>
		);
	}
);

const CustomDrawer = memo(() => {
	const dispatch = useDispatch();
	const router = useRouter();
	const segments = useSegments();
	const segmentPath = segments.join("/");
	const { setSessionValue } = useAuth();
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null); // Track the active submenu
	const [isPressed, setIsPressed] = useState(false);

	const toggleSubmenu = (key: string) => {
		setActiveSubmenu((prev) => (prev === key ? null : key)); // Toggle or close the current submenu
	};
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const getTextAndIconStyle = useMemo(
		() => (routeName: string) => ({
			color: routeName === segmentPath ? "white" : "#9a9b9f",
		}),
		[segments]
	);

	const clearStorageAndNavigate = async (router: any) => {
		try {
			await AsyncStorage.multiRemove([
				"session",
				"token",
				"UserId",
				"ApkVersion",
			]);
			router.push("/");
			setSessionValue(false);
		} catch (error) {
			console.error("Error clearing AsyncStorage or navigating:", error);
		}
	};
	const handleLogout = () => {
		dispatch(closeDrawer());

		const title = i18n.t("logout_title"); // e.g., "Logout"
		const message = i18n.t("logout_message"); // e.g., "Are you sure you want to logout?"
		const cancel = i18n.t("Cancel"); // e.g., "Cancel"
		const confirm = i18n.t("OK"); // e.g., "OK"

		if (typeof window !== "undefined" && Platform.OS === "web") {
			const isConfirmed = window.confirm(
				"Are you sure you want to logout?"
			);
			if (isConfirmed) {
				clearStorageAndNavigate(router);
			}
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: cancel,
						onPress: () => console.log("Logout canceled"),
						style: "cancel",
					},
					{
						text: confirm,
						onPress: () => clearStorageAndNavigate(router),
						style: "destructive",
					},
				],
				{ cancelable: true }
			);
		}
	};
	const navigationToRoute = (item: any) => {
		if (isLandscape) {
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT
			); // Switch to portrait mode
			dispatch(setOrientation(false)); // Update the state to reflect the change
		}

		if (item?.route && !item?.route.startsWith("http")) {
			setActiveSubmenu(null);
			if (segmentPath !== item?.route) {
				//dispatch(activeLoading());
				router.replace(item?.route as Href);
			}
		} else if (item?.route?.startsWith("http")) {
			if (Platform.OS === "web") {
				window.open(item.route, "_blank");
			} else {
				Linking.openURL(item.route);
			}
		}
		dispatch(closeDrawer());
	};

	return (
		<ScrollView
			className="flex-1 bg-[#fff] mt-5"
			showsVerticalScrollIndicator={false}
		>
			{menuItems.map((menu: any, index) => {
				// Check if there are items in the submenu
				const hasItems = menu.items?.length > 0;
				return (
					<View key={index}>
						{/* Render simple View if no submenu items */}
						{hasItems ? (
							<TouchableOpacity
								activeOpacity={0.6}
								className={`flex-row items-center  p-5   break-words  `}
								onPress={() => toggleSubmenu(menu?.key)}
							>
								{menu?.icon}
								<Text
									className={`text-lg font-semibold ml-4 text-chartText  flex-1 break-words `}
									onPress={() => toggleSubmenu(menu?.key)}
								>
									{i18n.t(menu?.label)}
								</Text>
								<Feather
									className="mr-10"
									name={
										activeSubmenu === menu?.key
											? "chevron-up"
											: "chevron-down"
									}
									size={18}
									color="#9a9b9f"
									onPress={() => toggleSubmenu(menu?.key)}
								/>
							</TouchableOpacity>
						) : (
							// Render the default View if no submenu items
							<View key={index}>
								<TouchableOpacity
									key={index}
									activeOpacity={0.7}
									className={`flex-row items-center p-5 ${
										menu.route === segmentPath
											? "bg-primary"
											: "bg-transparent"
									} `}
									onPress={() => navigationToRoute(menu)}
								>
									{React.cloneElement(
										menu?.icon,
										getTextAndIconStyle(menu?.route)
									)}
									<Text
										className={`text-lg font-semibold ml-4 bg-yellow text-chartText  ${
											menu?.label === "portfolio"
												? "uppercase"
												: "capitalize"
										}`}
										style={getTextAndIconStyle(menu?.route)}
									>
										{i18n.t(menu?.label)}
									</Text>
								</TouchableOpacity>
							</View>
						)}

						{/* Render submenu if items are present */}
						{hasItems && (
							<Submenu
								isVisible={activeSubmenu === menu?.key}
								height={menu?.height}
							>
								{menu?.items.map(
									(submenu: any, subIndex: any) => (
										<TouchableOpacity
											activeOpacity={0.6}
											key={subIndex}
											className={`pl-16 py-3 ${
												submenu.route === segmentPath
													? "bg-primary"
													: "bg-transparent"
											}`}
											onPress={() =>
												navigationToRoute(submenu)
											}
										>
											<Text
												className="text-lg font-normal text-chartText"
												style={getTextAndIconStyle(
													submenu?.route
												)}
											>
												{i18n.t(submenu?.label)}
											</Text>
										</TouchableOpacity>
									)
								)}
							</Submenu>
						)}
					</View>
				);
			})}
			{/**Divider */}
			<View className="w-full h-px bg-gray-300 my-2 " />

			{/* Logout */}
			<TouchableOpacity
				className={`flex-row items-center  p-5  mt-2 ${
					isPressed && "bg-primary"
				}`}
				activeOpacity={1}
				onPress={handleLogout}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
			>
				<MaterialIcons
					name="logout"
					size={27}
					color={isPressed ? "white" : "#e31837"}
					style={{ transform: [{ scaleX: -1 }] }}
				/>
				<Text
					className={`text-xl font-bold capitalize ml-4 ${
						isPressed ? "text-white" : "text-primary"
					} `}
				>
					{i18n.t("logout")}
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
});

const areEqual = (prevProps: any, nextProps: any) =>
	prevProps.pathnames === nextProps.pathnames;

export default React.memo(CustomDrawer, areEqual);
