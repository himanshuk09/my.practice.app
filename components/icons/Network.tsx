import { Animated, Pressable } from "react-native";
import React, { useRef } from "react";
import useRetryNetwork from "@/hooks/useRetryNetwork";
import { Ionicons } from "@expo/vector-icons";

const NetworkRetry = () => {
	const rotation = useRef(new Animated.Value(0)).current;
	const retryNetworkCheck = useRetryNetwork();
	const retryConnection = () => {
		rotation.setValue(0); // reset before animating
		Animated.timing(rotation, {
			toValue: 1,
			duration: 600, // duration in ms
			useNativeDriver: true,
		}).start();
		// trigger network retry
		retryNetworkCheck();
	};

	const spin = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<Pressable onPress={retryConnection}>
			<Animated.View style={{ transform: [{ rotate: spin }] }}>
				<Ionicons name="reload-circle" size={35} color="white" />
			</Animated.View>
		</Pressable>
	);
};
export default NetworkRetry;
