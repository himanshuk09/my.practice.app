/**
 * Login Screen
 */
import {
	View,
	Text,
	Keyboard,
	Platform,
	TextInput,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import Logo from "@/components/svg/Logo";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { i18n } from "@/localization/config";
import { loginUser } from "@/services/auth.service";
import { showToast } from "@/components/ToastConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RoundedButton from "@/components/ui/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { AUTHKEYS, NETWORKKEYS, ROUTEKEYS } from "@/utils/messages";

const SignIn: React.FC = () => {
	const { setSessionValue } = useAuth();
	const isOnline = useSelector(
		(state: RootState) => state?.network.isConnected
	);
	const [status, setStatus] = useState<"idle" | "loading" | "success">(
		"idle"
	);
	const [userName, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [isUserNameFocused, setIsUserNameFocused] = useState<boolean>(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);

	const validateInput = (userName: string, password: string): string => {
		if (userName.trim() === "" && password.trim() === "") {
			return AUTHKEYS.MISSING_USERNAME_AND_PASSWORD;
		}
		if (userName.trim() === "") {
			return AUTHKEYS.MISSING_USERNAME;
		}
		if (password.trim() === "") {
			return AUTHKEYS.MISSING_PASSWORD;
		}
		if (!AUTHKEYS.USERNAME_REGEX.test(userName)) {
			return AUTHKEYS.INVALID_USERNAME;
		}
		return ""; // No error
	};

	const handleSubmit = async (): Promise<void> => {
		// Validate input
		const validationError = validateInput(userName, password);
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}
		setErrorMessage("");
		try {
			Keyboard.dismiss();
			setStatus("loading");
			if (!isOnline) {
				setErrorMessage(NETWORKKEYS.NO_INTERNET);
				setStatus("idle");
				return;
			}
			const payload = {
				username: userName,
				password: password,
			};
			// Call the loginUser API function
			const response = await loginUser(payload);

			if (response?.success) {
				setStatus("success");
				setTimeout(() => {
					setSessionValue(true);
					setTimeout(() => {
						showToast({
							type: "success",
							title: AUTHKEYS.SUCCESS,
						});
					}, 500);
				}, 500);
			} else {
				setStatus("idle");
				setErrorMessage(response?.message || AUTHKEYS.FAILURE);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setErrorMessage(
					err instanceof Error ? err.message : AUTHKEYS.UNKNOWN_ERROR
				);
			} else {
				setErrorMessage(AUTHKEYS.UNKNOWN_ERROR);
			}
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
					<View className="flex-1 justify-center items-center">
						<View className="w-11/12 max-w-md p-5">
							<View className="items-center mb-10 w-full">
								<Logo />
							</View>

							<View className="mb-5">
								{/** Username Feild*/}
								<View className="relative">
									<TextInput
										id="username" // ✅ Useful for form autofill
										value={userName}
										key={"username_input"}
										autoCapitalize="none"
										spellCheck={false}
										autoComplete="username" // ✅ Enables username autofill
										placeholderTextColor="#808080"
										placeholder={i18n.t("username")}
										textContentType="username"
										onFocus={() =>
											setIsUserNameFocused(true)
										}
										onBlur={() =>
											setIsUserNameFocused(false)
										}
										onChangeText={(text) => {
											setUserName(text);
											if (errorMessage !== "")
												setErrorMessage("");
										}}
										className={`pr-10 pl-3 py-3 w-full rounded-sm text-lg ${Platform.OS === "web" && " placeholder-[#808080]  p-3 outline-none  rounded-md  text-lg "}`}
										style={{
											backgroundColor: "#E5E7EB",
											borderColor: errorMessage
												? "#EF4444" // Red border for error
												: isUserNameFocused
													? "#3B82F6" // Blue border on focus
													: "#D1D5DB", // Default gray border
											borderWidth: 1,
											marginBottom: 15,
											color: "#808080",
											textDecorationLine: "none",

											...(Platform.OS !== "web"
												? {
														shadowColor:
															errorMessage
																? "#FCA5A5" // Red shadow for error
																: isUserNameFocused
																	? "#3B82F6" // Blue shadow on focus
																	: "transparent",
														shadowOffset: {
															width: 0,
															height: 1,
														},
														shadowOpacity:
															errorMessage ||
															isUserNameFocused
																? 0.8
																: 0,
														shadowRadius:
															errorMessage ||
															isUserNameFocused
																? 10
																: 0,
														elevation:
															errorMessage ||
															isUserNameFocused
																? 4
																: 0, // Android shadow
													}
												: null),
										}}
									/>

									<TouchableOpacity
										style={{
											position: "absolute",
											right: 13,
											top:
												Platform.OS === "web" ? 15 : 11,
											zIndex: 100,
										}}
										activeOpacity={0.8}
									>
										<FontAwesome
											name="user"
											size={26}
											color="#6b7280"
											style={{
												zIndex: 100,
											}}
										/>
									</TouchableOpacity>
								</View>

								{/**Password Feild */}
								<View className="relative">
									<TextInput
										id="password"
										value={password}
										autoCapitalize="none"
										spellCheck={false}
										key={"password_input"}
										textContentType="password"
										placeholderTextColor="#808080"
										placeholder={i18n.t("password")}
										secureTextEntry={hidePassword}
										autoComplete="current-password" // ✅ Enables password autofill
										onChangeText={(text) => {
											setPassword(text);
											if (errorMessage !== "")
												setErrorMessage("");
										}}
										onFocus={() =>
											setIsPasswordFocused(true)
										}
										onBlur={() =>
											setIsPasswordFocused(false)
										}
										className={`pr-10 pl-3 py-3 w-full rounded-sm text-lg ${Platform.OS === "web" && "p-3 outline-none  rounded-md  text-lg "}`}
										style={{
											backgroundColor: "#E5E7EB",
											borderColor: errorMessage
												? "#EF4444" // Red border for error
												: isPasswordFocused
													? "#3B82F6" // Blue border on focus
													: "#D1D5DB", // Default gray border
											borderWidth: 1,
											borderRadius: 2,
											marginBottom: 5,
											color: "#808080",
											textDecorationLine: "none",
											zIndex: 0,
											// Shadow Handling
											...(Platform.OS !== "web"
												? {
														shadowColor:
															errorMessage
																? "#FCA5A5" // Red shadow for error
																: isPasswordFocused
																	? "#3B82F6" // Blue shadow on focus
																	: "transparent",
														shadowOffset: {
															width: 0,
															height: 1,
														},
														shadowOpacity:
															errorMessage ||
															isPasswordFocused
																? 0.8
																: 0,
														shadowRadius:
															errorMessage ||
															isPasswordFocused
																? 100
																: 0,
														elevation:
															errorMessage ||
															isPasswordFocused
																? 9
																: 0, // Android shadow
													}
												: null),
										}}
										onSubmitEditing={handleSubmit}
									/>

									<TouchableOpacity
										activeOpacity={0.5}
										style={{
											position: "absolute",
											right: 13,
											top:
												Platform.OS === "web" ? 15 : 11,
											zIndex: 100,
										}}
										onPress={() =>
											setHidePassword(!hidePassword)
										}
									>
										<FontAwesome
											name={
												hidePassword
													? "lock"
													: "unlock-alt"
											}
											size={26}
											color="#6b7280"
										/>
									</TouchableOpacity>
								</View>
								{/**Error Handler */}
								{errorMessage ? (
									<Text className="text-red-500  font-normal text-left text-sm">
										{i18n.t(errorMessage)}
									</Text>
								) : null}

								{/**Login Button */}
								<RoundedButton
									title="login"
									onPress={handleSubmit}
									disabled={
										status === "loading" ||
										(userName.trim() === "" &&
											password.trim() === "")
									}
									status={status}
								/>
								{/** Forget password screen redirector */}
								<Link
									href={ROUTEKEYS.FORGOT_PASSWORD}
									onPress={() => {
										if (Keyboard.isVisible()) {
											Keyboard.dismiss();
										}
									}}
									className="mx-auto my-5 p-4"
									disabled={status === "loading"}
									asChild
								>
									<Text className="text-red-600 capitalize underline text-center text-sm">
										{i18n.t("forgotyourpassword")}
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

export default SignIn;
