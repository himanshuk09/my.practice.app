import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { i18n } from "@/localization/config";

const PrimaryButton = ({
	onPress,
	title,
	disabled = false,
	style,
}: {
	onPress: () => void;
	title: string;
	disabled?: boolean;
	style?: string;
}) => {
	return (
		<TouchableOpacity
			className={`bg-primary rounded-sm py-3 mx-4 mb-2 ${style}`}
			onPress={onPress}
			disabled={disabled}
		>
			<Text className="text-white text-center text-base font-normal uppercase">
				{i18n.t(title)}
			</Text>
		</TouchableOpacity>
	);
};

export default PrimaryButton;
