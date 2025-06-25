import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { i18n } from "@/localization/config";

const RoundedButton = ({
	onPress,
	title,
	disabled,
	style,
	loading = false,
}: {
	onPress: () => void;
	title: string;
	disabled: boolean;
	style?: string;
	loading?: boolean;
}) => {
	return (
		<TouchableOpacity
			className={`mt-9 p-3 rounded-full items-center bg-primary ${style}`}
			onPress={onPress}
			disabled={disabled}
		>
			{loading ? (
				<ActivityIndicator size={25} color={"white"} />
			) : (
				<Text className="text-white font-medium text-xl uppercase">
					{i18n.t(title)}
				</Text>
			)}
		</TouchableOpacity>
	);
};

export default RoundedButton;
