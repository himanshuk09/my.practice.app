import {
	View,
	Animated,
	StyleSheet,
	PanResponder,
	Platform,
	Pressable,
} from "react-native";
import React, { useEffect, useRef } from "react";
import CustomDrawer from "@/components/CustomDrawer";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer, toggleDrawer } from "@/store/drawerSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Drawer = ({ drawerWidth = 280 }: any) => {
	const dispatch = useDispatch();
	let debounceTimeout: any = null;
	const isDrawerOpen = useSelector((state: any) => state.drawer.isDrawerOpen);
	const translateX = useRef(new Animated.Value(-drawerWidth)).current;
	const insets = useSafeAreaInsets();
	const handleCloseDrawer = () => {
		dispatch(closeDrawer());
	};

	const debounceAction = (action: () => void) => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = setTimeout(action, 300);
	};
	const debounceToggleDrawer = () => {
		debounceAction(() => {
			// On Left swipe detected!
			dispatch(toggleDrawer());
		});
	};
	const debounceCloseDrawer = () => {
		debounceAction(() => {
			//On Right to left swipe detected, closing drawer!
			dispatch(closeDrawer());
		});
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (e, gestureState) => {
			if (
				gestureState.moveX < 50 &&
				gestureState.dx > 20 &&
				!isDrawerOpen
			) {
				debounceToggleDrawer();
			}
			if (gestureState.dx < -20 && isDrawerOpen) {
				debounceCloseDrawer();
			}
		},
		onPanResponderRelease: () => true,
	});

	useEffect(() => {
		Animated.timing(translateX, {
			toValue: isDrawerOpen ? 0 : -drawerWidth,
			duration: 100,
			useNativeDriver: Platform.OS !== "web" ? true : false,
		}).start();
	}, [isDrawerOpen]);

	return (
		<>
			<View
				{...panResponder.panHandlers}
				style={[
					StyleSheet.absoluteFill,
					Platform.OS === "web" ? { cursor: "pointer" } : {},
				]}
				className="font-sans"
			/>
			{/* Drawer Content */}
			<Animated.View
				style={[
					styles.drawer,
					Platform.OS === "web" && styles.webDrawer,
					{
						width: drawerWidth,
						transform: [{ translateX: translateX }],
						paddingTop: insets.top,
					},
				]}
			>
				<CustomDrawer />
			</Animated.View>
			{/* Overlay */}
			{isDrawerOpen && (
				<Pressable onPress={handleCloseDrawer} style={styles.overlay}>
					<View />
				</Pressable>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	drawer: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		backgroundColor: "#fff",
		zIndex: 100,
		height: "100%",

		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOpacity: 0.1,
				shadowRadius: 5,
				shadowOffset: { width: 0, height: 0 },
			},
			android: {
				elevation: 10,
			},
			default: {
				// Web
				boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
				willChange: "transform",
			},
		}),
	},
	overlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 99,
	},
	webDrawer: {
		position: "fixed" as any,
		height: "100vh" as any,
		boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
		willChange: "transform",
	},
});

export default Drawer;
