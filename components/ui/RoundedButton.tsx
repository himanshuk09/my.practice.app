import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { i18n } from "@/localization/config";
import { Entypo } from "@expo/vector-icons";

const RoundedButton = ({
	onPress,
	title,
	disabled,
	style,
	status = "idle",
}: {
	onPress: () => void;
	title: string;
	disabled: boolean;
	style?: string;
	status?: "idle" | "loading" | "success";
}) => {
	return (
		<TouchableOpacity
			className={`mt-9 p-3 rounded-full items-center bg-primary ${style}`}
			onPress={onPress}
			disabled={disabled}
		>
			{status === "idle" && (
				<Text className="text-white font-medium text-xl uppercase">
					{i18n.t(title)}
				</Text>
			)}

			{status === "loading" && (
				<ActivityIndicator size={25} color={"white"} />
			)}

			{status === "success" && (
				<Entypo name="check" size={24} color="white" />
			)}
		</TouchableOpacity>
	);
};

export default RoundedButton;
