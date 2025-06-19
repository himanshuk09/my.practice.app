import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
	TextStyle,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import Title from "@/components/ui/Title";
import { StatusBar } from "expo-status-bar";
import { i18n } from "@/localization/config";
import { FontAwesome } from "@expo/vector-icons";
import CustomAlert from "@/components/CustomAlert";
import { useIsFocused } from "@react-navigation/native";
import RatingStars from "@/components/icons/RatingStars";
import { inActiveLoading } from "@/store/navigationSlice";
import FooterActions from "@/components/ui/FooterActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Rate = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [ratingMsg, setRatingMsg] = useState<string>("");
	const insets = useSafeAreaInsets();

	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
	}, [isFocused]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar
				style="light"
				translucent
				animated
				hideTransitionAnimation="fade"
				networkActivityIndicatorVisible
			/>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
				>
					<View
						style={{
							flex: 1,
							backgroundColor: "white",
							marginBottom: insets.bottom,
						}}
					>
						<StatusBar
							style="light"
							translucent
							animated
							hideTransitionAnimation="fade"
							networkActivityIndicatorVisible
						/>
						{/* Header */}

						<Title title={"rateus"} />
						{/* Main Content */}
						<ScrollView
							className="flex-1"
							contentContainerStyle={{
								padding: 15,
								justifyContent: "center",
								alignItems: "center",
							}}
							keyboardShouldPersistTaps="handled"
							nestedScrollEnabled
							showsVerticalScrollIndicator={false}
						>
							<Text className="font-extrabold text-md text-slate-400 text-center mb-5">
								{i18n.t(
									"how_is_your_experience_with_our_app_so_far"
								)}
							</Text>

							<RatingStars maxStars={5} />
							{/* Feedback Input */}
							<View className="w-full p-2 relative">
								<TextInput
									// className="pr-10 pl-3 py-3 bg-gray-200 border h-40 w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 focus:shadow-[#D8EAF9] focus:shadow-2xl rounded-lg text-lg align-top z-1"
									className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 rounded-sm text-lg h-36"
									placeholder={i18n.t("message")}
									placeholderTextColor={"#808080"}
									value={ratingMsg}
									onChangeText={setRatingMsg}
									multiline={true}
									numberOfLines={6}
									style={{ paddingRight: 30 }}
									textAlignVertical="top"
									inputMode="text"
								/>
								<FontAwesome
									style={{
										position: "absolute",
										right: 20,
										top: 20,
										zIndex: 100,
									}}
									name="pencil"
									size={20}
									color="#6b7280"
									className="z-50"
								/>
							</View>
						</ScrollView>

						{/* Footer Buttons */}
						<FooterActions
							leftTitle="cancel"
							leftOnPress={() => router.back()}
							rightTitle="save"
							rightOnPress={async () => {
								CustomAlert({
									title: "submit",
									description: "thank_you_for_your_feedback",
									showCancelButton: true,
									icon: "success",
									iconColor: "#e31837",
									buttons: [
										{
											text: i18n.t("Cancel"),
											textStyle: {
												fontSize: 16,
												fontWeight: "600",
												color: "#808080",
											} as TextStyle,
											onPress: () => null,
										},
										{
											text: i18n.t("OK"),
											textStyle: {
												fontSize: 16,
												fontWeight: "bold",
												color: "#e31837",
												textTransform: "uppercase",
											} as TextStyle,
											onPress: () =>
												router.push("/dashboard"),
										},
									],
								});
							}}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Rate;
