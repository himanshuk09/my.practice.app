import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Linking,
	Platform,
} from "react-native";
import {
	getCurrentPushToken,
	registerForPushNotificationsAsync,
} from "@/components/wrapper/NotificationWrapper";
import { st } from "@/utils/Styles";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import { Href, useRouter } from "expo-router";
import CustomAlert from "@/components/CustomAlert";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";
import { updateLocale } from "@/store/languageSlice";
import CustomSwitch from "@/components/CustomSwitch";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { englishLocale, germanyLocale, i18n } from "@/localization/config";

const Settings = () => {
	const router = useRouter();
	const isFocused = useIsFocused();
	const insets = useSafeAreaInsets();
	const dispatch: AppDispatch = useDispatch();
	const { locale } = useSelector((state: RootState) => state.culture);
	const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
	const [isSignalsEnabled, setIsSignalsEnabled] = useState<boolean>(false);
	const [isNotificationEnabled, setIsNotificationEnabled] =
		useState<boolean>(false);

	const [copiedText, setCopiedText] = useState("");
	const copyToClipboard = async () => {
		await Clipboard.setStringAsync(copiedText);
	};
	useEffect(() => {
		const token: any = getCurrentPushToken();
		setCopiedText(token);
		if (isNotificationEnabled) copyToClipboard();
	}, [isNotificationEnabled]);

	const handleNotificationSwitchToggle = async (newValue: boolean) => {
		setIsNotificationEnabled(newValue);
		setIsSignalsEnabled(newValue);

		if (!newValue || Platform.OS === "web") return;

		try {
			const { status } = await Notifications.getPermissionsAsync();
			const wasPromptedBefore = await AsyncStorage.getItem(
				"notification_prompted"
			);

			if (status !== "granted") {
				if (!wasPromptedBefore) {
					// First time asking permission
					await AsyncStorage.setItem("notification_prompted", "true");
					const { status: newStatus } =
						await Notifications.requestPermissionsAsync();

					if (newStatus !== "granted") {
						setIsNotificationEnabled(false);
						setIsSignalsEnabled(false);
						return;
					}
				} else {
					setIsNotificationEnabled(false);
					setIsSignalsEnabled(false);
					CustomAlert({
						title: "Permission_Required",
						description:
							"Please_enable_notifications_in_system_settings",
						cancelText: "Ask_Me_Later",
						confirmText: "Open_Settings",
						onConfirm: () => {
							if (Platform.OS !== "web") {
								Linking.openSettings();
							}
						},
					});
					return;
				}
			}

			// Permission is granted; try getting token
			const token = await registerForPushNotificationsAsync();
			if (!token) {
				setIsNotificationEnabled(false);
				setIsSignalsEnabled(false);
				CustomAlert({
					title: "Permission_Required",
					description:
						"Please_enable_notifications_in_system_settings",
					cancelText: "Ask_Me_Later",
					confirmText: "Open_Settings",
					onConfirm: () => {
						if (Platform.OS !== "web") {
							Linking.openSettings();
						}
					},
				});
			}
		} catch (error: any) {
			console.error("Notification error:", error);
			setIsNotificationEnabled(false);
			setIsSignalsEnabled(false);
			CustomAlert({
				title: "Error",
				description: error.message || "Something went wrong",
				cancelText: "OK",
				confirmText: "",
				onConfirm: () => {},
			});
		}
	};

	// Handle signals toggle (only allowed when notifications are on)
	const handleSignalsToggle = async (newValue: boolean) => {
		if (isNotificationEnabled) {
			setIsSignalsEnabled(newValue);
		}
	};

	useEffect(() => {
		const loadInitialState = async () => {
			const { status } = await Notifications.getPermissionsAsync();

			const notipref = await AsyncStorage.getItem(
				"notification_preference"
			);
			const signalpref = await AsyncStorage.getItem("signal_preference");
			if (status == "granted") {
				setIsNotificationEnabled(notipref === "enabled");

				if (notipref === "enabled")
					setIsSignalsEnabled(signalpref === "enabled");
			}
		};
		if (isFocused) {
			dispatch(inActiveLoading());
			loadInitialState();
		}
	}, [isFocused]);
	const handleSave = async () => {
		dispatch(updateLocale(selectedLanguage));

		// Save language preference
		await AsyncStorage.setItem("app_locale", selectedLanguage);

		// Save notification preference
		await AsyncStorage.setItem(
			"notification_preference",
			isNotificationEnabled ? "enabled" : "disabled"
		);

		// Save signals preference
		await AsyncStorage.setItem(
			"signal_preference",
			isSignalsEnabled ? "enabled" : "disabled"
		);

		router.replace("/dashboard" as Href);
	};
	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
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
			<View className=" w-full z-50 p-3 mt-1 bg-primary">
				<Text className="flex justify-start font-normal  py-2 p-3  items-center  h-16 text-xl capitalize rounded-sm text-white">
					{i18n.t("settings")}
				</Text>
			</View>
			<View className="p-2 mb-2 pl-5 bg-white" style={st.boxShadow}>
				<Text className="text-base font-semibold capitalize text-dropdownSecondTitle">
					{i18n.t("language")}
				</Text>

				<Picker
					selectedValue={selectedLanguage}
					onValueChange={(newValue) => setSelectedLanguage(newValue)}
					className="w-full p-3 border-b-2"
					mode="dropdown"
					{...(Platform.OS !== "web" && {
						dropdownIconColor: "#000",
						dropdownIconRippleColor: "#c1c1c1",
					})}
				>
					<Picker.Item
						label="ENGLISH"
						value={englishLocale}
						style={{
							color: "#0f172a",
							fontSize: 15,
							fontWeight: "900",
							backgroundColor: "white",
						}}
					/>
					<Picker.Item
						label="DEUTSCH"
						value={germanyLocale}
						style={{
							color: "#0f172a",
							fontSize: 15,
							fontWeight: "900",
							backgroundColor: "white",
						}}
					/>
				</Picker>
			</View>
			<View className="p-2  pl-5  bg-white" style={st.boxShadow}>
				<Text className="text-base capitalize font-semibold text-dropdownSecondTitle">
					{i18n.t("notifications")}
				</Text>
				<View className="flex flex-row items-center justify-between my-4">
					<Text className="pl-5 text-base text-gray-800 font-normal capitalize">
						{i18n.t("show_notifications")}
					</Text>
					<View className="w-20 mr-3">
						<CustomSwitch
							isEnabled={isNotificationEnabled}
							setIsEnabled={handleNotificationSwitchToggle}
						/>
					</View>
				</View>
				<View className="flex flex-row items-center justify-between mb-4">
					<Text className="pl-5 text-base text-gray-800 font-normal capitalize">
						{i18n.t("signals")}
					</Text>
					<View className="w-20 mr-3">
						<CustomSwitch
							isEnabled={isSignalsEnabled}
							setIsEnabled={handleSignalsToggle}
						/>
					</View>
				</View>
			</View>

			<View className="bottom-0 bg-white w-full right-0 left-0 absolute flex flex-row justify-evenly border-y-2 border-primary">
				<TouchableOpacity
					className="items-center p-5 w-[50%]"
					onPress={() => {
						router.back();
						setSelectedLanguage(locale);
					}}
				>
					<Text className="text-center text-primary font-normal uppercase ">
						{i18n.t("cancel")}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="items-center p-5  w-[50%] bg-primary"
					onPress={handleSave}
				>
					<Text className="text-center text-white uppercase font-normal">
						{i18n.t("save")}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default Settings;
