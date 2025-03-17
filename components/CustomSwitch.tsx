import { useState } from "react";
import { Platform } from "react-native";
import { Animated, View, TouchableOpacity } from "react-native";

const CustomSwitch = ({ isEnabled = true, setIsEnabled }: any) => {
	const [translateX] = useState(new Animated.Value(isEnabled ? 30 : 0));

	const toggleSwitch = () => {
		setIsEnabled(!isEnabled);

		Animated.spring(translateX, {
			toValue: isEnabled ? 0 : 30, // Adjusting to smaller size
			useNativeDriver: Platform.OS !== "web" ? true : false,
		}).start();
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
					backgroundColor: isEnabled ? "#e31837" : "#c1c1c1",
					borderRadius: 12, // Half of the height
					justifyContent: "center",
					alignItems: "center",
					position: "relative",
					padding: 1,
				}}
				onPress={toggleSwitch}
			>
				<Animated.View
					style={{
						width: 18, // Reduced size of the circle
						height: 18, // Reduced size of the circle
						borderRadius: 9, // Half of the height
						backgroundColor: "white",
						position: "absolute",
						top: 3, // Adjusting for smaller size
						left: 3, // Adjusting for smaller size
						transform: [{ translateX }],
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};
export default CustomSwitch;
