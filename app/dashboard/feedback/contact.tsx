import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
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
import FooterActions from "@/components/ui/FooterActions";
import { inActiveLoading } from "@/store/navigationSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ContactUs = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const insets = useSafeAreaInsets();

	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
	}, [isFocused]);

	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: insets.bottom }}>
			<StatusBar
				style="light"
				translucent
				animated
				hideTransitionAnimation="fade"
				networkActivityIndicatorVisible
			/>
			<Title title={"contactus"} />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "white",
						paddingBottom: insets.bottom,
					}}
				>
					<ScrollView
						className="flex-1"
						contentContainerStyle={{ padding: 15, flexGrow: 1 }}
						keyboardShouldPersistTaps="handled"
						nestedScrollEnabled
						showsVerticalScrollIndicator={false}
					>
						{/* Name */}
						<View className="w-full p-2 relative mb-1">
							<TextInput
								className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 rounded-sm text-lg"
								placeholder={i18n.t("name")}
								placeholderTextColor={"#808080"}
								value={name}
								onChangeText={setName}
								autoCapitalize="words"
							/>
							<FontAwesome
								style={{
									position: "absolute",
									right: 20,
									top: 20,
								}}
								name="user"
								size={20}
								color="#6b7280"
							/>
						</View>
						{/* Phone Field */}
						<View className="w-full p-2 relative mb-1">
							<TextInput
								className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 rounded-sm text-lg"
								placeholder={i18n.t("phone")}
								placeholderTextColor={"#808080"}
								value={phone}
								onChangeText={setPhone}
								keyboardType="phone-pad"
							/>
							<FontAwesome
								style={{
									position: "absolute",
									right: 20,
									top: 20,
								}}
								name="phone"
								size={20}
								color="#6b7280"
							/>
						</View>
						{/* Email Field */}
						<View className="w-full p-2 relative mb-1">
							<TextInput
								className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 rounded-sm text-lg"
								placeholder={i18n.t("email")}
								placeholderTextColor={"#808080"}
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							<FontAwesome
								style={{
									position: "absolute",
									right: 20,
									top: 20,
								}}
								name="envelope"
								size={20}
								color="#6b7280"
							/>
						</View>

						{/* Message Field */}
						<View className="w-full p-2 relative">
							<TextInput
								className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 rounded-sm text-lg h-40"
								placeholder={i18n.t("message")}
								placeholderTextColor={"#808080"}
								value={message}
								onChangeText={setMessage}
								multiline={true}
								numberOfLines={6}
								keyboardType="numbers-and-punctuation"
								textAlignVertical="top"
							/>
							<FontAwesome
								style={{
									position: "absolute",
									right: 20,
									top: 20,
								}}
								name="pencil"
								size={20}
								color="#6b7280"
							/>
						</View>
					</ScrollView>

					{/* Footer */}
					<FooterActions
						leftTitle="cancel"
						leftOnPress={() => router.back()}
						rightTitle="save"
						rightOnPress={async () => {
							console.log("Message sent:", {
								name,
								phone,
								email,
								message,
							});

							CustomAlert({
								title: "submit",
								description: "message_sent_successfully",
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
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
export default ContactUs;
