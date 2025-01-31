import { Platform, StyleSheet } from "react-native";

export const st = StyleSheet.create({
    boxShadow: {
        // For iOS and Android
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 5,
            },
            android: {
                elevation: 7,
            },
        }),
        // For web
        ...(Platform.OS === "web" && {
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.7)", // Standard CSS box-shadow
        }),
    },
    tabShadow: {
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 1,
            },
            default: {
                // Web
                boxShadow: "0px 3px 7px rgba(0, 0, 0, 0.1)",
            },
        }),
    },
    headerShadow: {
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
            },
            android: {
                elevation: 15,
            },
            default: {
                // Web
                boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.5)",
            },
        }),
    },
    bottomShadow: {
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
            },
            android: {
                elevation: 15,
            },
            default: {
                // Web
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.5)",
            },
        }),
    },
});
