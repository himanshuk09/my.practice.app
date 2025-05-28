import React, { useRef } from "react";
import { ActivityIndicator, Animated, Pressable } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const Reload = ({ type = "", onPress = () => {} }: any) => {
	const rotation = useRef(new Animated.Value(0)).current;
	const retryConnection = () => {
		rotation.setValue(0); // reset before animating
		Animated.timing(rotation, {
			toValue: 1,
			duration: 600, // duration in ms
			useNativeDriver: true,
		}).start();
		onPress();
	};

	const spin = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<Pressable onPress={retryConnection}>
			<Animated.View style={{ transform: [{ rotate: spin }] }}>
				{type === "network" ? (
					<Ionicons name="reload-circle" size={35} color="white" />
				) : type === "update" ? (
					<FontAwesome name="refresh" size={25} color="white" />
				) : (
					<ActivityIndicator color="white" size="small" />
				)}
			</Animated.View>
		</Pressable>
	);
};
export default Reload;
