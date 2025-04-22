import { Platform } from "react-native";
import * as Permissions from "expo-permissions"; // legacy
import * as MediaLibrary from "expo-media-library"; // preferred

export const requestStoragePermission = async () => {
	if (Platform.OS !== "android") return;

	// Ask for media library permission (covers photo/video access)
	const { status, canAskAgain } =
		await MediaLibrary.requestPermissionsAsync();

	if (status === "granted") {
		console.log("✅ Media library permission granted");
	} else if (!canAskAgain) {
		console.log("❌ Permission denied permanently");
		// You may guide user to settings here
	} else {
		console.log("⛔ Permission denied, will ask again later");
	}
};
