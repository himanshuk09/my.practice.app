import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return "com.himanshukhade.eec.dev";
    }

    if (IS_PREVIEW) {
        return "com.himanshukhade.eec.preview";
    }

    return "com.himanshukhade.eec";
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
    slug: "eec",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/applogo.png",
    scheme: "enexion",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/applogo.png",
            backgroundColor: "#cccccc",
        },
        package: getUniqueIdentifier(),
        permissions: ["WRITE_EXTERNAL_STORAGE", "READ_EXTERNAL_STORAGE"],
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
                image: "./assets/images/appicon.png",
                resizeMode: "contain",
                backgroundColor: "#ffffff",
                imageWidth: 200,
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
            projectId: "261c7cd7-9be9-4634-81da-49c109f43d68",
        },
    },
});
