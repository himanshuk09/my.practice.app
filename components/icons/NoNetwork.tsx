import { View, Text, Platform, Dimensions, Image } from "react-native";
import React from "react";
// import LottieView from "lottie-react-native";
import { i18n } from "@/localization/config";

const NoNetwork = () => {
	const isWeb = Platform.OS === "web";
	const animationSize = isWeb ? 300 : 200;
	return (
		<View className="bg-white flex-1 items-center justify-center h-full">
			{/* <LottieView
				source={require("@/assets/lottie/no-connection.json")}
				autoPlay={true}
				loop={Platform.OS === "android"}
				progress={Platform.OS === "web" ? 0 : undefined}
				style={{
					width: animationSize,
					height: animationSize,
					transform: [{ rotate: "20deg" }], // rotate left
				}}
			/> */}
			<Image
				source={require("@/assets/gif/no-connection.gif")} // Local GIF
				style={{
					width: animationSize - 20,
					height: animationSize,
					resizeMode: "contain",
					transform: [{ rotate: "20deg" }], // rotate left
				}}
			/>
			<Text className="text-2xl mt-3 font-medium text-mainCardHeaderText">
				{i18n.t("No_Internet_Connection")}
			</Text>
		</View>
	);
};

export default NoNetwork;
