import { View, Text, Dimensions, Platform, Image } from "react-native";
import React from "react";
// import LottieView from "lottie-react-native";
import { i18n } from "@/localization/config";

const NoData = () => {
	const isWeb = Platform.OS === "web";
	const animationSize = isWeb ? 300 : 200; // 30% of screen width on web
	return (
		<View className="bg-white flex-1 items-center justify-center">
			{/* <LottieView
				source={require("@/assets/lottie/no-data-new.json")}
				autoPlay={true}
				loop={Platform.OS === "android"}
				progress={Platform.OS === "web" ? 0 : undefined}
				style={{
					width: animationSize,
					height: animationSize,
				}}
			/> */}
			<Image
				source={require("@/assets/gif/no-data-new.gif")} // Local GIF
				style={{
					width: animationSize + 50,
					height: animationSize + 10,
				}}
			/>
			<Text className="text-2xl mt-3 font-medium text-mainCardHeaderText mb-10 ">
				{i18n.t("Data_not_available")}
			</Text>
		</View>
	);
};

export default NoData;
