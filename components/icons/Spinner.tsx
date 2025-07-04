import { Image, View } from "react-native";
import React from "react";
// import LottieView from "lottie-react-native";

const Spinner = () => {
	return (
		<View>
			{/* <LottieView
				source={require("@/assets/lottie/spinner.json")}
				autoPlay
				loop
				style={{
					width: 25,
					height: 25,
				}}
			/> */}
			<Image
				source={require("@/assets/gif/spinner.gif")} // Local GIF
				style={{
					width: 25,
					height: 25,
				}}
			/>
		</View>
	);
};

export default Spinner;
