import "react-native-reanimated";
import React from "react";
import { Stack } from "expo-router";
import Drawer from "@/components/Drawer";
import Header from "@/components/MainHeader";
import SwipeDetectionWrapper from "@/components/Wrapper/SwipeDetectionWrapper";

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
						statusBarAnimation: "slide",
					}}
				>
					<Stack.Screen
						name="index"
						options={{
							headerShown: true,
							animation: "slide_from_left",
							header: ({ navigation }) => (
								<Header navigation={navigation} />
							),
						}}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="settings"
						options={{
							headerShown: true,
							animation: "slide_from_right",
							header: ({ navigation }) => (
								<Header navigation={navigation} />
							),
						}}
					/>
					<Stack.Screen
						name="feedback"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="legalnotes"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</SwipeDetectionWrapper>
		</React.Fragment>
	);
};

export default DashboardLayout;
