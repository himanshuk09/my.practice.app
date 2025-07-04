import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	TextStyle,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import Title from "@/components/ui/Title";
import { i18n } from "@/localization/config";
import { FontAwesome } from "@expo/vector-icons";
import CustomAlert from "@/components/CustomAlert";
import { AUTHKEYS, ROUTEKEYS } from "@/utils/messages";
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
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
			setKeyboardVisible(true)
		);
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
			setKeyboardVisible(false)
		);

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Title title={"rateus"} />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={
					Platform.OS === "ios" ? 60 : isKeyboardVisible ? 115 : 0
				}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "white",
						marginBottom: insets.bottom,
					}}
				>
					{/* Header */}

					{/* Main Content */}
					<ScrollView
						className="flex-1"
						contentContainerStyle={{
							padding: 15,
							flexGrow: 1,
							paddingBottom: 100,
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
						dismissOnPress={() =>
							router.dismissTo(ROUTEKEYS.DASHBOARD)
						}
						confirmOnPress={async () => {
							CustomAlert({
								title: AUTHKEYS.SUBMIT,
								description: AUTHKEYS.SUBMIT_FEEDBACK,
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
											router.dismissTo(
												ROUTEKEYS.DASHBOARD
											),
									},
								],
							});
						}}
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Rate;
