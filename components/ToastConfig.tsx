import {
	Feather,
	FontAwesome6,
	Fontisto,
	MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import * as Sharing from "expo-sharing";
import { i18n } from "@/localization/config";
import * as FileSystem from "expo-file-system";
import Reload from "@/components/icons/Reload";
import { PERMISSIONKEYS } from "@/utils/messages";
import { getBottomInset } from "@/components/global";
import AnimatedArrowSVG from "./svg/AnimatedArrowSVG";
import * as IntentLauncher from "expo-intent-launcher";
import ThreeDotLoader from "@/components/icons/ThreeDotLoader";
import Toast, { ToastShowParams } from "react-native-toast-message";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

type ToastType = "success" | "error" | "info" | "download";

interface ShowToastParams
	extends Omit<ToastShowParams, "type" | "text1" | "text2" | "position"> {
	type: ToastType;
	title: string;
	subtitle?: string;
	position?: "bottom" | "top";
	props?: {
		update?: boolean;
		network?: boolean;
		spinner?: boolean;
		onPress?: () => void;
		fileUri?: string;
		fileName?: string;
		type?: any;
	};
}

/**
 * Show a toast using react-native-toast-message with i18n support and typed options.
 */
const showToast = ({
	type,
	title,
	subtitle,
	position = "bottom",
	autoHide = true,
	swipeable = false,
	bottomOffset,
	visibilityTime,
	...options
}: ShowToastParams): void => {
	Toast.show({
		type,
		text1: i18n.t(title),
		text2: subtitle ? i18n.t(subtitle) : undefined,
		position,
		topOffset: 0,
		bottomOffset: bottomOffset
			? bottomOffset + getBottomInset()
			: getBottomInset(),
		visibilityTime: 3000,
		autoHide,
		swipeable,
		avoidKeyboard: true,
		...options,
	});
};

const openCSVFile = async (fileUri: string) => {
	try {
		if (Platform.OS === "android") {
			await IntentLauncher.startActivityAsync(
				"android.intent.action.VIEW",
				{
					data: fileUri,
					flags: 1,
					type: "text/csv",
				}
			);
		} else {
			await Linking.openURL(fileUri);
		}
	} catch (error) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.CANT_OPEN_CSV,
			subtitle: PERMISSIONKEYS.INSTALLED_CSV_VIEWER,
		});
	}
};

const openPNGFile = async (fileUri: string) => {
	try {
		// Fix 1: Always use content URI for Android
		const contentUri = await FileSystem.getContentUriAsync(fileUri);

		if (Platform.OS === "android") {
			// Fix 2: Use proper MIME type and content URI
			await IntentLauncher.startActivityAsync(
				"android.intent.action.VIEW",
				{
					data: contentUri,
					type: "image/png",
					flags: 1,
				}
			);
		}
	} catch (error) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.CANT_OPEN_FILE,
			subtitle: PERMISSIONKEYS.INSTALLED_FILE_VIEWER,
		});
	}
};

const shareFile = async (fileName: string, fileUri: string) => {
	if (!(await Sharing.isAvailableAsync())) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.SHARING_NOT_AVAILABLE,
		});
		return;
	}

	try {
		// 1. Create destination path in cache directory
		const destUri = FileSystem.cacheDirectory + fileName;

		// 2. Copy the content URI file to app's cache
		await FileSystem.copyAsync({
			from: fileUri,
			to: destUri,
		});

		// 3. Share the copied file
		await Sharing.shareAsync(destUri);
	} catch (error: any) {
		showToast({
			type: "error",
			title: PERMISSIONKEYS.UNABLED_TO_SHARED,
		});
	}
};

const sharePNGFile = async (fileName: string) => {
	try {
		const cleanName = fileName.startsWith("file://")
			? fileName
			: `file://${fileName}`;

		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(cleanName);
		}
	} catch (error) {
		console.error("Failed to share file:", error);
		showToast({
			type: "error",
			title: PERMISSIONKEYS.FAILED_TO_SHARED_PNG,
			subtitle: PERMISSIONKEYS.ENSURE_SHARING,
		});
	}
};

const toastConfig: any = {
	success: ({ text1, text2 }: any) => (
		<View className="flex-row items-center py-3 px-5 w-full bg-cardBg rounded-sm">
			{/* Success Icon */}
			<Feather
				name="check-circle"
				size={24}
				color="#e31837"
				className="mr-3"
			/>

			{/* Text Content */}
			<View className="flex-1">
				<Text className="text-md font-semibold text-listText">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-listText mt-0.5">
						{text2}
					</Text>
				) : null}
			</View>
		</View>
	),
	error: ({ text1, text2, props }: any) => (
		<View className="flex-row items-center py-3 px-5 w-full bg-[#5D5D5D] rounded-sm">
			{/* Error Icon */}
			<MaterialIcons
				name="error-outline"
				size={24}
				color="white"
				style={{ marginRight: 12, marginVertical: 10 }}
			/>

			{/* Text Content */}
			<View className="flex-1">
				<Text className="text-lg font-semibold text-white">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-white">{text2}</Text>
				) : null}
			</View>
			{/* Right side: Action Buttons */}
			<View className="flex-row gap-3 ml-3">
				{props?.network && Platform.OS !== "web" && (
					<Reload type={"network"} onPress={props.onPress} />
				)}
			</View>
		</View>
	),
	info: ({ text1, text2, props }: any) => (
		<View className="flex-row items-center py-3 px-5 w-full bg-[#5D5D5D] rounded-sm">
			{props?.update && Platform.OS !== "web" ? (
				<MaterialIcons
					name="security-update"
					size={24}
					color="white"
					className="mr-2"
				/>
			) : (
				<MaterialIcons
					name="info"
					size={24}
					color="white"
					className="mr-2"
				/>
			)}
			<View className="flex-1">
				<Text className="text-lg font-semibold text-white">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-white">{text2}</Text>
				) : null}
			</View>
			<View className="flex-row gap-3 ml-3">
				{props?.update && Platform.OS !== "web" && (
					<Reload type={"update"} onPress={props.onPress} />
				)}
			</View>
		</View>
	),

	download: ({ text1, text2, props }: any) => (
		<View className="flex-row justify-between items-center py-3 px-5 w-full bg-[#5D5D5D] rounded-sm">
			{/* Left side: Icon + Text + Spinner */}
			<View className="flex-row items-center flex-1">
				{/* Download Icon */}
				{props?.spinner ? (
					<AnimatedArrowSVG height={25} width={25} color={"#fff"} />
				) : (
					<MaterialIcons
						name="file-download"
						size={24}
						color="white"
						className="mr-3"
					/>
				)}

				{/* Text Content */}
				<View className="flex-1">
					<Text className="text-md font-semibold text-white">
						{text1}
					</Text>
					{text2 ? (
						<Text className="text-sm text-white">{text2}</Text>
					) : null}
				</View>

				{/* Spinner */}
				{props?.spinner && (
					<View className="ml-2">
						<ThreeDotLoader />
					</View>
				)}
			</View>

			{/* Right side: Action Buttons */}
			<View className="flex-row gap-3 ml-3">
				{props?.fileUri && (
					<TouchableOpacity
						className="flex-row items-center px-1 py-2 rounded-full"
						onPress={() => {
							if (
								props?.type === "csv" ||
								props?.type === "pdf"
							) {
								openCSVFile(props.fileUri);
							} else {
								openPNGFile(props.fileUri);
							}
						}}
					>
						<Text className="text-white mr-1 font-semibold underline uppercase">
							{i18n.t("Open")}
						</Text>
						<FontAwesome6
							name={
								props?.type === "png"
									? "file-image"
									: props?.type === "csv"
										? "file-csv"
										: "file-pdf"
							}
							size={12}
							color="white"
						/>
					</TouchableOpacity>
				)}
				{props?.fileName && (
					<TouchableOpacity
						className="flex-row items-center px-1 py-2 rounded-full"
						onPress={() => {
							if (
								props?.type === "csv" ||
								props?.type === "pdf"
							) {
								shareFile(props.fileName, props?.fileUri);
							} else {
								sharePNGFile(props.fileName);
							}
						}}
					>
						<Text className="text-white mr-1 font-semibold underline uppercase">
							{i18n.t("Share")}
						</Text>
						<Fontisto name="share-a" size={10} color="white" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	),
};

export default toastConfig;
export { Toast, showToast };
