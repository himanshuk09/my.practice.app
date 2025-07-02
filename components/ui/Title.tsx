import React from "react";
import { Text, View } from "react-native";
import { i18n } from "@/localization/config";

const Title = ({ title }: { title: string }) => {
	return (
		<View className="w-full p-3 bg-primary">
			<Text className="flex justify-start font-normal py-2 p-3 capitalize items-center mb-4 h-14 text-xl rounded-sm text-white">
				{i18n.t(title)}
			</Text>
		</View>
	);
};

export default Title;
