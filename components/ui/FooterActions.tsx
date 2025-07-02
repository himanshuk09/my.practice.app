import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { i18n } from "@/localization/config";

const FooterActions = ({
	dismissText = "cancel",
	confirmText = "save",
	dismissOnPress,
	confirmOnPress,
}: {
	dismissText?: string;
	confirmText?: string;
	dismissOnPress: () => void;
	confirmOnPress: () => void;
}) => {
	return (
		<View className="bottom-0 bg-white w-full right-0 left-0 absolute flex flex-row justify-evenly border-y-2 border-primary">
			<TouchableOpacity
				className="items-center p-4 w-[50%]"
				onPress={dismissOnPress}
			>
				<Text className="text-center text-primary font-normal uppercase ">
					{i18n.t(dismissText)}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className="items-center p-4  w-[50%] bg-primary"
				onPress={confirmOnPress}
			>
				<Text className="text-center text-white uppercase font-normal">
					{i18n.t(confirmText)}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FooterActions;
