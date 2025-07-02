import React from "react";
import { useRouter } from "expo-router";
import { i18n } from "@/localization/config";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform } from "react-native";

const StackHeader = ({
	title,
	navigation,
	closed = false,
}: {
	title: string;
	navigation?: any;
	closed?: boolean;
}) => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	return (
		<View
			className="bg-chartHeaderBg px-4 items-end justify-start py-6 flex-row h-20"
			style={{
				marginTop: closed === false ? insets.top : 0,
			}}
		>
			<TouchableOpacity
				onPress={() => {
					if (Platform.OS === "web") {
						window.history.back();
						return;
					}
					router.dismiss();
					// router.back();
				}}
				className="w-7 ml-3"
			>
				<MaterialIcons name="arrow-back" size={27} color="#9a9b9f" />
			</TouchableOpacity>
			<Text className="ml-2  text-2xl text-chartText">
				{i18n.t(title)}
			</Text>
		</View>
	);
};

export default StackHeader;
