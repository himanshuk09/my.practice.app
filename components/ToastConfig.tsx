import * as Sharing from "expo-sharing";
import { useEffect, useRef } from "react";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { Animated, Easing } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import {
	AntDesign,
	FontAwesome6,
	Fontisto,
	MaterialIcons,
} from "@expo/vector-icons";

const AnimatedSpinner = () => {
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const spinAnimation = Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1000, // 1 second per full rotation
				easing: Easing.linear,
				useNativeDriver: true, // Ensures smooth performance
			})
		);
		spinAnimation.start();
		return () => spinAnimation.stop();
	}, []);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"], // Rotates 360 degrees
	});

	return (
		<Animated.View style={{ transform: [{ rotate: spin }] }}>
			{/* <EvilIcons name="spinner-2" size={24} color="black" /> */}
			<AntDesign name="loading1" size={20} color="white" />
		</Animated.View>
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
		console.error("Failed to open file:", error);
		Toast.show({
			type: "error",
			text1: "Cannot Open CSV",
			text2: "Make sure a CSV viewer is installed.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
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
		Toast.show({
			type: "error",
			text1: "Cannot Open File",
			text2: "Install a file viewer app (e.g., Google Files) to open PNGs.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
		});
	}
};
const shareFile = async (fileName: string, fileUri: string) => {
	if (!(await Sharing.isAvailableAsync())) {
		Toast.show({
			type: "error",
			text1: "Sharing isn't available on your platform",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
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
		Toast.show({
			type: "error",
			text1: "Unabled to shared",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
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
		Toast.show({
			type: "error",
			text1: "Failed to Share PNG",
			text2: "Ensure your device supports sharing.",
			position: "bottom",
			bottomOffset: 0,
			visibilityTime: 3000,
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
		<View className="flex-row justify-start items-start py-3 px-5 w-full bg-[#5D5D5D] rounded-sm">
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

				{props?.spinner && Platform.OS !== "web" && <AnimatedSpinner />}
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
							Open
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
							Share
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
