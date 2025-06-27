import React from "react";
import AnimatedArrowSVG from "../svg/AnimatedArrowSVG";
import { FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";

const DownloadFIleIcon: React.FC<{
	showIcon?: boolean;
	size?: number;
	color?: string | any;
	onPress?: any;
	height?: number;
	width?: number;
}> = ({
	showIcon = true,
	size = 30,
	color = "#e31837",
	onPress,
	height,
	width,
}) => {
	return showIcon || Platform.OS === "web" ? (
		<FontAwesome5
			classname="mr-2"
			name="file-download"
			size={size}
			color={color}
			onPress={onPress}
		/>
	) : (
		<AnimatedArrowSVG height={height} width={width} />
	);
};

export default DownloadFIleIcon;
