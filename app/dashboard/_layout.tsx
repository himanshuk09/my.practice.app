/**
 * Dashboard Layout
 */
import "react-native-reanimated";
import React from "react";
import { Stack } from "expo-router";
import Drawer from "@/components/Drawer";
import Header from "@/components/ui/MainHeader";
import SwipeDetectionWrapper from "@/components/wrapper/SwipeDetectionWrapper";

const DashboardLayout = () => {
	return (
		<React.Fragment>
			<Drawer drawerWidth={290} />
			<SwipeDetectionWrapper>
				<Stack
					screenOptions={{
						headerShown: false,
						gestureEnabled: true,
						gestureDirection: "vertical",
						contentStyle: { backgroundColor: "white" },
						statusBarAnimation: "fade",
					}}
				>
					<Stack.Screen
						name="index"
						options={{
							headerShown: true,
							animation: "fade",
							header: ({ navigation }) => <Header />,
						}}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
							animation: "ios_from_right",
						}}
					/>
					<Stack.Screen
						name="settings"
						options={{
							headerShown: true,
							animation: "ios_from_right",
							header: ({ navigation }) => <Header />,
						}}
					/>
					<Stack.Screen
						name="feedback"
						options={{
							headerShown: false,
							animation: "ios_from_left",
						}}
					/>
					<Stack.Screen
						name="legalnotes"
						options={{
							headerShown: false,
							animation: "ios_from_left",
						}}
					/>
				</Stack>
			</SwipeDetectionWrapper>
		</React.Fragment>
	);
};

export default DashboardLayout;
