import {
	View,
	Animated,
	Platform,
	Easing,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef } from "react";

export const CircularLoaderDefault = () => (
	<View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-[#f5f5f5ed] z-50">
		<ActivityIndicator size={70} color="#E31837" />
	</View>
);

const LoaderPNG = () => {
	const rotation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const startRotation = () => {
			Animated.loop(
				Animated.timing(rotation, {
					toValue: 1,
					duration: 1500, // 1.3 seconds for a full rotation
					useNativeDriver: Platform.OS === "android",
					easing: Easing.linear,
				})
			).start();
		};

		startRotation();
	}, [rotation]);

	const rotate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-[#fffffff1] z-50">
			<Animated.Image
				source={require("@/assets/images/ic_loader2.png")} // Update the path if needed
				style={[{ width: 64, height: 64 }, { transform: [{ rotate }] }]}
			/>
		</View>
	);
};

export const ChartLoaderPNG = () => {
	const rotation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const startRotation = () => {
			Animated.loop(
				Animated.timing(rotation, {
					toValue: 1,
					duration: 1800, // 1.5 seconds for a full rotation
					useNativeDriver: Platform.OS === "android",
					easing: Easing.linear,
				})
			).start();
		};

		startRotation();
	}, [rotation]);

	const rotate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<View className="absolute top-1 left-0 right-0 bottom-0 justify-center items-center bg-[#fff] z-50">
			<Animated.Image
				source={require("@/assets/images/ic_loader2.png")} // Update the path if needed
				style={[{ width: 64, height: 64 }, { transform: [{ rotate }] }]}
			/>
		</View>
	);
};

export default LoaderPNG;
