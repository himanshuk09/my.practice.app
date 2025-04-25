import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Toast, { ToastShowParams } from "react-native-toast-message";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import {
	AntDesign,
	FontAwesome6,
	Fontisto,
	MaterialIcons,
} from "@expo/vector-icons";
import { i18n } from "@/localization/config";
import LottieView from "lottie-react-native";
type ToastType = "success" | "error" | "info" | "download";

interface ShowToastParams
	extends Omit<ToastShowParams, "type" | "text1" | "text2" | "position"> {
	type: ToastType;
	title: string;
	subtitle?: string;
	position?: "bottom" | "top";
}

/**
 * Show a toast using react-native-toast-message with i18n support and typed options.
 */
export const showToast = ({
	type,
	title,
	subtitle,
	position = "bottom",
	...options
}: ShowToastParams): void => {
	Toast.show({
		type,
		text1: i18n.t(title),
		text2: subtitle ? i18n.t(subtitle) : undefined,
		position,
		bottomOffset: 0,
		visibilityTime: type === "error" ? 2000 : 3000,
		autoHide: true,
		topOffset: 0,
		...options,
	});
};
const Spinner = () => {
	return (
		<View>
			<LottieView
				source={require("@/assets/lottie/spinner.json")}
				autoPlay
				loop
				style={{
					width: 25,
					height: 25,
				}}
			/>
		</View>
	);
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
			title: "Cannot_Open_CSV",
			subtitle: "Make_sure_a_CSV_viewer_is_installed",
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
			title: "Cannot_Open_File",
			subtitle: "install_a_file_viewer",
		});
	}
};
const shareFile = async (fileName: string, fileUri: string) => {
	if (!(await Sharing.isAvailableAsync())) {
		showToast({
			type: "error",
			title: "Sharing_isnot_available_on_your_platform",
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
			title: "Unabled_to_shared",
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
			title: "Failed_to_Share_PNG",
			subtitle: "Ensure_your_device_supports_sharing",
		});
	}
};

const toastConfig: any = {
	success: ({ text1, text2 }: any) => (
		<View className="flex-row justify-start items-start py-3 px-5 w-full bg-cardBg rounded-sm">
			<View>
				<Text className="text-md justify-start items-center font-semibold text-listText">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-listText">{text2}</Text>
				) : null}
			</View>
		</View>
	),
	error: ({ text1, text2, ...rest }: any) => (
		<View className="flex-row justify-start items-start py-3 px-5 w-full bg-[#e31837]  rounded-sm">
			{/** bg-[#5D5D5D]*/}
			<View>
				<Text className="text-lg justify-start items-center font-semibold text-white">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-white">{text2}</Text>
				) : null}
			</View>
		</View>
	),
	info: ({ text1, text2, ...rest }: any) => (
		<View className="flex-row items-center p-4 mx-10 bg-blue-100 rounded-lg">
			<MaterialIcons
				name="info"
				size={24}
				color="blue"
				className="mr-2"
			/>
			<View className="flex-1">
				<Text className="text-lg font-semibold text-blue-800">
					{text1}
				</Text>
				{text2 ? (
					<Text className="text-sm text-blue-700">{text2}</Text>
				) : null}
			</View>
		</View>
	),
	download: ({ text1, text2, props }: any) => (
		<View className="flex-row justify-between items-start py-3 px-5 w-full  bg-[#5D5D5D] rounded-sm">
			<View className="mx-3 flex justify-between flex-row ">
				<View
					className={`${props?.spinner && Platform.OS !== "web" ? "w-[90%]" : ""}`}
				>
					<Text className="text-md justify-start items-center font-semibold text-white">
						{text1}
					</Text>
					{text2 ? (
						<Text className="text-sm text-white">{text2}</Text>
					) : null}
				</View>

				{props?.spinner && Platform.OS !== "web" && <Spinner />}
			</View>
			<View className="mx-3 flex-row gap-3">
				{props?.fileUri && (
					<TouchableOpacity
						className=" flex-row px-1 py-2 my-2 rounded-full"
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
						<Text className="text-white mr-1  font-semibold underline uppercase">
							{i18n.t("Open")}
						</Text>
						{props?.type === "png" ? (
							<FontAwesome6
								name="file-image"
								size={12}
								color="white"
								className="my-1"
							/>
						) : props?.type === "csv" ? (
							<FontAwesome6
								name="file-csv"
								size={12}
								color="white"
								className="my-1"
							/>
						) : (
							<FontAwesome6
								name="file-pdf"
								size={12}
								color="white"
								className="my-1"
							/>
						)}
					</TouchableOpacity>
				)}
				{props?.fileName && (
					<TouchableOpacity
						className="flex-row px-1 py-2 my-2 rounded-full"
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
						<Fontisto
							name="share-a"
							size={10}
							color="white"
							className="my-1"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	),
};

export default toastConfig;
