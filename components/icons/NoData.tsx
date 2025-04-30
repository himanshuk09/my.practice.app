import { View, Text, Dimensions, Platform } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { i18n } from "@/localization/config";

const NoData = () => {
	const { width } = Dimensions.get("window");

	const isWeb = Platform.OS === "web";
	const animationSize = isWeb ? width : 200; // 30% of screen width on web
	return (
		<View className="bg-white flex-1 items-center justify-center">
			<LottieView
				source={require("@/assets/lottie/no-data-new.json")}
				autoPlay={true}
				loop={Platform.OS === "android"}
				progress={Platform.OS === "web" ? 0 : undefined}
				style={{
					width: animationSize,
					height: animationSize,
				}}
			/>

			<Text className="text-2xl mt-3 font-medium text-mainCardHeaderText mb-10 ">
				{i18n.t("Data_not_available")}
			</Text>
		</View>
	);
};

export default NoData;
