import { Platform, StyleSheet } from "react-native";

export const st = StyleSheet.create({
	boxShadow: {
		// For iOS and Android
		...Platform.select({
			ios: {
				shadowColor: "#000000",
				shadowOffset: {
					width: 0,
					height: 5,
				},
				shadowOpacity: 0.2,
				shadowRadius: 5.62,
				elevation: 7,
			},
			android: {
				shadowColor: "#474646",
				shadowOffset: {
					width: 0,
					height: 15,
				},
				shadowOpacity: 0.24,
				shadowRadius: 17.43,
				elevation: 21,
			},
		}),
		// For web
		...(Platform.OS === "web" && {
			boxShadow: "0 0 3px rgba(0, 0, 0, 0.7)", // Standard CSS box-shadow
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
				boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1)",
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
				shadowColor: "#474646",
				shadowOffset: {
					width: 0,
					height: 11,
				},
				shadowOpacity: 0.23,
				shadowRadius: 11.78,
				elevation: 15,
			},
			default: {
				// Web
				boxShadow: "0px -2px 2px rgba(0, 0, 0, 0.2)",
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
				boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.3)",
			},
		}),
	},
});
