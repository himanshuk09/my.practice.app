import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/ui/MainHeader";
import { i18n } from "@/localization/config";
import { Tabs, useSegments } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

export let isIdRoute: boolean;

// Main Tab Navigator
const TabNavigatorLayout = () => {
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

	isIdRoute = idRoutes.includes(segmentPath);

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
				style="light"
				translucent
				animated
				hideTransitionAnimation="fade"
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
