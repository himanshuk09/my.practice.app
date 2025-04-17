import React from "react";
import { useRouter } from "expo-router";
import { i18n } from "@/localization/config";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Platform } from "react-native";

const StackHeader = ({ title, closed = false, setModalVisible }: any) => {
	const router = useRouter();
	return (
		<View className="bg-chartHeaderBg px-4 items-center justify-start py-6 flex-row h-20">
			<TouchableOpacity
				onPress={() => {
					if (closed) {
						setModalVisible(false);
						return;
					}

					if (Platform.OS === "web") {
						window.history.back();
						return;
					}
					router.back();
				}}
				className="w-7 ml-3"
			>
				<MaterialIcons name="arrow-back" size={27} color="#9a9b9f" />
			</TouchableOpacity>
			<Text className="ml-2 font-semibold text-xl text-chartText">
				{i18n.t(title)}
			</Text>
		</View>
	);
};

export default StackHeader;
