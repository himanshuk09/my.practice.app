import {
	LOCALSTORAGEKEYS,
	AUTHKEYS,
	PERMISSIONKEYS,
	ROUTEKEYS,
} from "@/utils/messages";
import {
	getCurrentPushToken,
	registerForPushNotificationsAsync,
} from "@/components/wrapper/NotificationWrapper";
import { st } from "@/utils/Styles";
import Title from "@/components/ui/Title";
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
import FooterActions from "@/components/ui/FooterActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { englishLocale, germanyLocale, i18n } from "@/localization/config";
import { View, Text, Linking, Platform, SafeAreaView } from "react-native";

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

	const [copiedText, setCopiedText] = useState<string | null>(null);

	const copyToClipboard = async (): Promise<void> => {
		if (copiedText !== null) {
			await Clipboard.setStringAsync(copiedText);
		}
	};

	const handleNotificationSwitchToggle = async (newValue: boolean) => {
		setIsNotificationEnabled(newValue);
		setIsSignalsEnabled(newValue);

		if (!newValue || Platform.OS === "web") return;

		try {
			const { status } = await Notifications.getPermissionsAsync();
			const wasPromptedBefore = await AsyncStorage.getItem(
				LOCALSTORAGEKEYS.NOTIFICATION_PROMPTED
			);

			if (status !== "granted") {
				if (!wasPromptedBefore) {
					// First time asking permission
					await AsyncStorage.setItem(
						LOCALSTORAGEKEYS.NOTIFICATION_PROMPTED,
						"true"
					);
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
						title: PERMISSIONKEYS.PERMISSION_REQUIRED,
						description: PERMISSIONKEYS.ENABLE_NOTIFICATION,
						cancelText: PERMISSIONKEYS.ASK_ME_LATER,
						confirmText: PERMISSIONKEYS.OPEN_SETTINGS,
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
					title: PERMISSIONKEYS.PERMISSION_REQUIRED,
					description: PERMISSIONKEYS.ENABLE_NOTIFICATION,
					cancelText: PERMISSIONKEYS.ASK_ME_LATER,
					confirmText: PERMISSIONKEYS.OPEN_SETTINGS,
					onConfirm: () => {
						if (Platform.OS !== "web") {
							Linking.openSettings();
						}
					},
				});
			}
		} catch (error: unknown) {
			console.error("Notification error:", error);
			setIsNotificationEnabled(false);
			setIsSignalsEnabled(false);
			CustomAlert({
				title: AUTHKEYS.ERROR_TEXT,
				description:
					error instanceof Error
						? error.message
						: AUTHKEYS.SOMETHING_WORNG,
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

	const handleSave = async () => {
		// Save language preference, notification preference, signals preference
		await AsyncStorage.multiSet([
			[
				LOCALSTORAGEKEYS.NOTIFICATION_PREFERENCE,
				isNotificationEnabled ? "enabled" : "disabled",
			],
			[
				LOCALSTORAGEKEYS.SIGNAL_PREFERENCE,
				isSignalsEnabled ? "enabled" : "disabled",
			],
		]);

		router.replace(ROUTEKEYS.DASHBOARD as Href);
		dispatch(updateLocale(selectedLanguage));
	};

	useEffect(() => {
		const loadInitialState = async () => {
			const { status } = await Notifications.getPermissionsAsync();

			const notipref = await AsyncStorage.getItem(
				LOCALSTORAGEKEYS.NOTIFICATION_PREFERENCE
			);
			const signalpref = await AsyncStorage.getItem(
				LOCALSTORAGEKEYS.SIGNAL_PREFERENCE
			);
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

	useEffect(() => {
		const token: string | null = getCurrentPushToken();
		setCopiedText(token);
		if (isNotificationEnabled) copyToClipboard();
	}, [isNotificationEnabled]);
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

			<Title title={"settings"} />
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

			<FooterActions
				leftTitle="cancel"
				leftOnPress={() => {
					router.back();
				}}
				rightTitle="save"
				rightOnPress={handleSave}
			/>
		</SafeAreaView>
	);
};

export default Settings;
