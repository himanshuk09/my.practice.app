import Header from "@/components/MainHeader";
import { i18n } from "@/localization/config";
import { activeLoading } from "@/store/navigationSlice";
import { RootState } from "@/store/store";
import { Tabs, useSegments } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
	Animated,
	View,
	TouchableOpacity,
	Text,
	ScrollView,
	SafeAreaView,
	StatusBar,
	Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
interface CustomTabBarProps {
	state: any;
	descriptors: any;
	navigation: any;
	notificationCounts: Record<string, number>;
}

// Custom Tab Bar
const CustomTabBar = ({
	state,
	descriptors,
	navigation,
	notificationCounts,
}: CustomTabBarProps) => {
	const dispatch = useDispatch();
	const scrollViewRef = useRef<ScrollView | null>(null);
	const tabRefs = useRef<(View | null)[]>([]);
	const animatedValues = useRef(
		state.routes.map(() => new Animated.Value(1))
	).current;

	useEffect(() => {
		const scrollToFocusedTab = () => {
			const focusedTabRef = tabRefs.current[state.index];
			if (focusedTabRef) {
				focusedTabRef.measure((x, y, width, height, pageX, pageY) => {
					if (scrollViewRef.current) {
						scrollViewRef.current.scrollTo({
							x: Math.max(0, pageX - 50),
							animated: true,
						});
					}
				});
			}
			state.routes.forEach((_: any, index: any) => {
				Animated.timing(animatedValues[index], {
					toValue: state.index === index ? 1.05 : 1,
					useNativeDriver: Platform.OS !== "web",
				}).start();
			});
		};

		scrollToFocusedTab();
	}, [state.index]);

	return (
		<View className="overflow-hidden h-10 bg-white ">
			<ScrollView
				ref={scrollViewRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					flexDirection: "row",
					alignItems: "center",
				}}
				className=""
			>
				{state.routes.map((route: any, index: any) => {
					const { options } = descriptors[route.key];
					const isFocused = state.index === index;
					const notificationCount =
						notificationCounts[route?.name] || 0;

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
						});

						if (!isFocused && !event.defaultPrevented) {
							setTimeout(() => {
								navigation.navigate(route.name);
							});
							dispatch(activeLoading());
						}
					};

					return (
						<Animated.View
							key={route.key}
							ref={(el: any) => (tabRefs.current[index] = el)}
							style={{
								transform: [
									{
										scale: animatedValues[index],
									},
								],
							}}
						>
							<TouchableOpacity
								className={`py-1  w-auto px-5 items-center justify-center ${
									isFocused && "opacity-100"
								}`}
								onPress={onPress}
							>
								<Text
									className={`font-medium uppercase text-lg ${
										isFocused
											? "text-activeText"
											: "text-inactiveText"
									}`}
								>
									{i18n.t(options.tabBarLabel || route.name)}
								</Text>
								{notificationCount > 0 && (
									<View
										className="bg-primary rounded-full justify-center items-center absolute top-1  right-0 w-4 h-4 "
										style={{
											alignSelf: "flex-start",
										}}
									>
										<Text className="text-white text-[8px] font-bold">
											{notificationCount}
										</Text>
									</View>
								)}
							</TouchableOpacity>
							{isFocused && (
								<View className="bg-activeText h-1 w-full" />
							)}
						</Animated.View>
					);
				})}
			</ScrollView>
		</View>
	);
};

// Main Tab Navigator
const TabNavigatorLayout = () => {
	// change the color of status bar on landscape
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	const segments = useSegments();
	const segmentPath = segments.join("/");
	// Routes to match (with parameter placeholders)
	const idRoutes = [
		"dashboard/(tabs)/loaddata/[id]",
		"dashboard/(tabs)/signals/[id]",
		"dashboard/(tabs)/portfolio/[id]",
		"dashboard/(tabs)/pfc/[id]",
		"dashboard/(tabs)/prices/[id]",
		"dashboard/(tabs)/prices/settings",
	];

	const isIdRoute = idRoutes.includes(segmentPath);

	const notificationCounts = {
		prices: 0,
		pfc: 0,
		loaddata: 0,
		signals: 1,
		portfolio: 0,
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{!isIdRoute && <Header />}
			<Tabs
				screenOptions={{
					tabBarButton: () => null,
					headerShown: false,
					animation: "shift",
					tabBarStyle: {
						backgroundColor: "transparent",
					},
					tabBarPosition: "top",
				}}
				tabBar={(props) => {
					if (isIdRoute) {
						return null;
					}
					return (
						<CustomTabBar
							{...props}
							notificationCounts={notificationCounts}
						/>
					);
				}}
			>
				<Tabs.Screen
					name="prices"
					options={{ title: i18n.t("prices") }}
				/>
				<Tabs.Screen
					name="pfc"
					options={{
						title: i18n.t("pfc"),
					}}
				/>
				<Tabs.Screen
					name="signals"
					options={{ title: i18n.t("signals") }}
				/>
				<Tabs.Screen
					name="loaddata"
					options={{ title: i18n.t("loaddata") }}
				/>
				<Tabs.Screen
					name="portfolio"
					options={{
						title: i18n.t("portfolio"),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
};

export default TabNavigatorLayout;
