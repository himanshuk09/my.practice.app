/**
 * Forgot password Screen
 */

import {
	View,
	Text,
	Platform,
	Keyboard,
	TextInput,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
} from "react-native";
import Logo from "@/components/svg/Logo";
import { i18n } from "@/localization/config";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { AUTHKEYS, ROUTEKEYS } from "@/utils/messages";
import Foundation from "@expo/vector-icons/Foundation";
import RoundedButton from "@/components/ui/RoundedButton";

const Forgotpassword = () => {
	const [email, setEmail] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
	const [status, setStatus] = useState<"idle" | "loading" | "success">(
		"idle"
	);
	const validateEmail = (text: string): boolean => {
		if (AUTHKEYS.EMAIL_REGEX.test(text)) {
			setErrorMessage("");
			return true;
		} else {
			setErrorMessage(AUTHKEYS.INVALID_EMAIL);
			return false;
		}
	};

	useEffect(() => {
		if (email) {
			const interval = setInterval(() => {
				validateEmail(email);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [email]);

	const handleSendEmail = () => {
		try {
			setStatus("loading");
			if (validateEmail(email)) {
				setTimeout(() => {
					setStatus("success");
				}, 2000);
			} else {
				setStatus("idle");
			}
		} catch (error) {
			setStatus("idle");
		}
	};
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
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
										onFocus={() => setIsEmailFocused(true)}
										onBlur={() => setIsEmailFocused(false)}
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
												Platform.OS === "web" ? 15 : 11,
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

								{/**Forgot Password Send Mail Botton */}
								<RoundedButton
									title="send"
									onPress={handleSendEmail}
									disabled={
										status === "loading" ||
										email.trim() === ""
									}
									status={status}
								/>

								<Link
									href={ROUTEKEYS.LOGIN}
									asChild
									onPress={() => {
										if (Keyboard.isVisible()) {
											Keyboard.dismiss();
										}
									}}
									className="mx-auto my-5  p-4"
								>
									<Text className="text-red-600 capitalize underline text-center text-sm">
										{i18n.t("login")}
									</Text>
								</Link>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Forgotpassword;
