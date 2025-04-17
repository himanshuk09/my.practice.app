import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	Pressable,
	StatusBar,
	Platform,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Href, useRouter } from "expo-router";
import Logo from "@/components/SVG/Logo";
import Foundation from "@expo/vector-icons/Foundation";
import { i18n } from "@/localization/config";
const Forgotpassword = () => {
	const router = useRouter();
	let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const [email, setEmail] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isEmailFocused, setIsEmailFocused] = useState(false);
	const validateEmail = (text: string) => {
		if (emailRegex.test(text)) {
			setErrorMessage("");
		} else {
			setErrorMessage("Please_enter_a_valid_email_address");
		}
	};

	useEffect(() => {
		if (email) {
			const interval = setInterval(() => {
				validateEmail(email);
			}, 2000);
			return () => clearInterval(interval);
		}
	}, [email]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#ffffff"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						if (Platform.OS !== "web") {
							Keyboard.dismiss();
						}
					}}
				>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						keyboardShouldPersistTaps="handled"
					>
						<View className="flex-1 justify-center items-center bg-white">
							<View className="w-11/12 max-w-md p-5">
								<View className="items-center mb-10 w-full">
									<Logo />
								</View>

								<View className="mb-5">
									<Text className="text-[15px] mb-5 text-gray-400 font-bold">
										{i18n.t(
											"Enter_your_registered_email_address_to_reset_your_password"
										)}
									</Text>

									<View className="relative">
										<TextInput
											autoCapitalize="none"
											keyboardAppearance="default"
											placeholder={i18n.t("email")}
											placeholderTextColor="#808080"
											textContentType="emailAddress"
											value={email}
											onFocus={() =>
												setIsEmailFocused(true)
											}
											onBlur={() =>
												setIsEmailFocused(false)
											}
											onChangeText={(text) => {
												setEmail(text);
												if (errorMessage !== "")
													setErrorMessage("");
											}}
											className={`pr-10 pl-3 py-3 w-full rounded-sm text-lg ${Platform.OS === "web" && " placeholder-[#808080]  p-3 outline-none  rounded-md  text-lg "}`}
											style={{
												backgroundColor: "#E5E7EB",
												borderColor: errorMessage
													? "#EF4444" // Red border for error
													: isEmailFocused
														? "#3B82F6" // Blue border on focus
														: "#D1D5DB", // Default gray border
												borderWidth: 1,
												marginBottom: 5,
												color: "#808080",
												textDecorationLine: "none",

												...(Platform.OS !== "web"
													? {
															shadowColor:
																errorMessage
																	? "#FCA5A5" // Red shadow for error
																	: isEmailFocused
																		? "#3B82F6" // Blue shadow on focus
																		: "transparent",
															shadowOffset: {
																width: 0,
																height: 1,
															},
															shadowOpacity:
																errorMessage ||
																isEmailFocused
																	? 0.8
																	: 0,
															shadowRadius:
																errorMessage ||
																isEmailFocused
																	? 10
																	: 0,
															elevation:
																errorMessage ||
																isEmailFocused
																	? 4
																	: 0, // Android shadow
														}
													: null),
											}}
										/>
										<Foundation
											style={{
												position: "absolute",
												right: 13,
												top:
													Platform.OS === "web"
														? 15
														: 11,
											}}
											name="mail"
											size={26}
											color="#6b7280"
										/>
									</View>
									{errorMessage ? (
										<Text className="text-red-500  font-normal text-left text-sm">
											{i18n.t(errorMessage)}
										</Text>
									) : null}
									<TouchableOpacity className="bg-primary p-3 mt-9 rounded-full items-center">
										<Text className="text-white text-lg font-semibold  uppercase">
											{i18n.t("send")}
										</Text>
									</TouchableOpacity>

									<Pressable
										onPress={() => {
											if (Keyboard.isVisible()) {
												Keyboard.dismiss();
											}
											router.replace(
												`/(auth)/login` as Href
											);
										}}
										className="mx-auto my-5  p-4"
									>
										<Text className="text-red-600 capitalize underline text-center text-sm">
											{i18n.t("login")}
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
export default Forgotpassword;
