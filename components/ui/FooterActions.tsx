import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { i18n } from "@/localization/config";

const FooterActions = ({
	leftTitle,
	rightTitle,
	leftOnPress,
	rightOnPress,
}: {
	leftTitle: string;
	rightTitle: string;
	leftOnPress: () => void;
	rightOnPress: () => void;
}) => {
	return (
		<View className="bottom-0 bg-white w-full right-0 left-0 absolute flex flex-row justify-evenly border-y-2 border-primary">
			<TouchableOpacity
				className="items-center p-4 w-[50%]"
				onPress={leftOnPress}
			>
				<Text className="text-center text-primary font-normal uppercase ">
					{i18n.t(leftTitle)}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className="items-center p-4  w-[50%] bg-primary"
				onPress={rightOnPress}
			>
				<Text className="text-center text-white uppercase font-normal">
					{i18n.t(rightTitle)}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FooterActions;
