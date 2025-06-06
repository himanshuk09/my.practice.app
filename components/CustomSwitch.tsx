import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Animated, View, TouchableOpacity } from "react-native";

const CustomSwitch = ({
	isEnabled = true,
	setIsEnabled,
	disabled = false,
}: any) => {
	// Initialize translateX based on current isEnabled state
	const translateX = useRef(new Animated.Value(isEnabled ? 30 : 0)).current;

	// Track the current enabled state for animation cleanup
	const currentEnabled = useRef(isEnabled);

	// Background color animation
	const backgroundColorAnim = useRef(
		new Animated.Value(isEnabled ? 1 : 0)
	).current;
	const bgColor = backgroundColorAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["#c1c1c1", "#e31837"], // Off color to on color
	});

	useEffect(() => {
		// Animate both position and color when isEnabled changes
		Animated.parallel([
			Animated.spring(translateX, {
				toValue: isEnabled ? 30 : 0,
				useNativeDriver: false,
			}),
			Animated.timing(backgroundColorAnim, {
				toValue: isEnabled ? 1 : 0,
				duration: 200,
				useNativeDriver: false,
			}),
		]).start();

		currentEnabled.current = isEnabled;
	}, [isEnabled]);

	const toggleSwitch = () => {
		if (!disabled) {
			const newValue = !currentEnabled.current;
			setIsEnabled(newValue);

			// No need to trigger animations here - the useEffect will handle it
		}
	};

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<TouchableOpacity
				activeOpacity={0.9}
				style={{
					width: 53,
					height: 24,
					borderRadius: 12,
					justifyContent: "center",
					padding: 1,
					opacity: disabled ? 0.5 : 1,
				}}
				onPress={toggleSwitch}
				disabled={disabled}
			>
				<Animated.View
					style={{
						...StyleSheet.absoluteFillObject,
						borderRadius: 12,
						backgroundColor: bgColor,
					}}
				/>
				<Animated.View
					style={{
						width: 18,
						height: 18,
						borderRadius: 9,
						backgroundColor: "white",
						position: "absolute",
						top: 3,
						left: 3,
						transform: [{ translateX }],
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};
export default CustomSwitch;
