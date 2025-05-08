import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
	if (IS_DEV) {
		return "com.enexion.eec.dev";
	}

	if (IS_PREVIEW) {
		return "com.enexion.eec.preview";
	}

	return "com.enexion.eec";
};

const getAppName = () => {
	if (IS_DEV) {
		return "eeC (Dev)";
	}

	if (IS_PREVIEW) {
		return "eeC (Preview)";
	}

	return "eeC";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: getAppName(),
	slug: "eec-cockpit",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icons/ios-light.png",
	scheme: "enexion",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		icon: {
			dark: "./assets/icons/ios-dark.png",
			light: "./assets/icons/ios-light.png",
			tinted: "./assets/icons/ios-tinted.png",
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/icons/adaptive-icon.png",
			monochromeImage: "./assets/icons/adaptive-icon.png",
			backgroundImage: "./assets/icons/adaptive-icon-bg.png",
			// backgroundColor: "#ffffff",
		},
		package: getUniqueIdentifier(),
		permissions: [
			"WRITE_EXTERNAL_STORAGE",
			"READ_EXTERNAL_STORAGE",
			"MANAGE_EXTERNAL_STORAGE",
		],
		softwareKeyboardLayoutMode: "pan",
	},
	web: {
		bundler: "metro",
		output: "single",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		"expo-localization",
		[
			"expo-splash-screen",
			{
				image: "./assets/icons/splash-icon-light.png",
				resizeMode: "contain",
				backgroundColor: "#ffffff",
				imageWidth: 200,
				dark: {
					image: "./assets/icons/splash-icon-dark.png",
					backgroundColor: "#ffffff",
				},
			},
		],
		[
			"expo-screen-orientation",
			{
				initialOrientation: "DEFAULT",
			},
		],
		[
			"expo-secure-store",
			{
				configureAndroidBackup: true,
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		router: {
			origin: false,
		},
		eas: {
			projectId: "ccdfe2b9-660f-4bf0-8feb-2edaebc5e910",
		},
	},

	owner: "himanshukhade",
});
