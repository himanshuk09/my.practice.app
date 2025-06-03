import { st } from "@/utils/Styles";
import { StatusBar } from "expo-status-bar";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { updateLocale } from "@/store/languageSlice";
import CustomSwitch from "@/components/CustomSwitch";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { englishLocale, germanyLocale, i18n } from "@/localization/config";
import * as Clipboard from "expo-clipboard";
import { getCurrentPushToken } from "@/components/services/notificationService";
import CustomAlert from "@/components/CustomAlert";
const Settings = () => {
	const router = useRouter();
	const isFocused = useIsFocused();
	const dispatch: AppDispatch = useDispatch();
	const { locale } = useSelector((state: RootState) => state.culture);
	const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
	const [isNotificationEnabled, setIsNotificationEnabled] =
		useState<boolean>(false);
	const [isSignalsEnabled, setIsSignalsEnabled] = useState<boolean>(true);
	const [copiedText, setCopiedText] = useState("");
	const copyToClipboard = async () => {
		await Clipboard.setStringAsync(copiedText);
		CustomAlert({
			title: "Copied",
		});
	};
	// {   "userId": "abc123",   "action": "test",   "priority": "low",   "url": "https://eec-cockpit.expo.app/dashboard" }
	const insets = useSafeAreaInsets();
	useEffect(() => {
		const currentToken: any = getCurrentPushToken();
		setCopiedText(currentToken);
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	useEffect(() => {
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
					className="w-full p-3 border-b-2 rounded-3xl"
					mode="dropdown"
					dropdownIconColor="#000"
					dropdownIconRippleColor="#c1c1c1"
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
							setIsEnabled={setIsNotificationEnabled}
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
							setIsEnabled={setIsSignalsEnabled}
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
					onPress={() => {
						dispatch(updateLocale(selectedLanguage));
						router.replace("/dashboard" as Href);
					}}
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
