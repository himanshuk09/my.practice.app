import React from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { View, PanResponder, StyleSheet } from "react-native";
import { closeDrawer, toggleDrawer } from "@/store/drawerSlice";
type SwipeDetectionWrapperProps = {
	children: React.ReactNode;
};

const SwipeDetectionWrapper: React.FC<SwipeDetectionWrapperProps> = ({
	children,
}) => {
	const dispatch = useDispatch();
	const isDrawerOpen = useSelector(
		(state: RootState) => state.drawer.isDrawerOpen
	);
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	const debounceAction = (action: () => void) => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = setTimeout(action, 300);
	};

	//Left swipe detected!
	const debounceToggleDrawer = () => {
		debounceAction(() => {
			dispatch(toggleDrawer());
		});
	};

	//Right to left swipe detected, closing drawer!
	const debounceCloseDrawer = () => {
		debounceAction(() => {
			dispatch(closeDrawer());
		});
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true, // Let the responder handle the touch event
		onMoveShouldSetPanResponder: () => true, // Allow movement during gesture
		onPanResponderMove: (e, gestureState) => {
			// Detect swipe gesture from the left side to open the drawer
			if (
				gestureState.moveX < 50 &&
				gestureState.dx > 20 &&
				!isDrawerOpen
			) {
				debounceToggleDrawer();
			}
			// Detect swipe gesture from the right side to close the drawer
			if (gestureState.dx < -20 && isDrawerOpen) {
				debounceCloseDrawer();
			}
		},
		onPanResponderRelease: () => true,
	});

	return (
		<View
			style={styles.container}
			{...panResponder.panHandlers}
			className="font-sans"
		>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject, // Cover the entire screen
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent", // Make it invisible
	},
});

export default SwipeDetectionWrapper;
