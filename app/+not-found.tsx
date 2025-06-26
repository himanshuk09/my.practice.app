/**
 * when any routes hit that not exist then this screen appear
 */

import React from "react";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AUTHKEYS, ROUTEKEYS } from "@/utils/messages";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { i18n } from "@/localization/config";
import { I18n } from "i18n-js";

export default function NotFoundScreen() {
	return (
		<React.Fragment>
			<Stack.Screen
				options={{ title: i18n.t(AUTHKEYS.NOT_FOUND_ROUTES) }}
			/>
			<View style={styles.container}>
				{/* Replace the require path with your image asset if necessary */}
				<Image
					source={require("@/assets/images/404-error.png")}
					style={styles.image}
					resizeMode="contain"
				/>

				<Text style={styles.title}>
					Oops! {i18n.t(AUTHKEYS.NOT_FOUND_ROUTES)}
				</Text>
				<Text style={styles.subtitle}>
					{i18n.t(AUTHKEYS.ERROR_PAGE_NOT_FOUND)}
				</Text>

				<Link href={ROUTEKEYS.INITIAL} asChild>
					<Pressable style={styles.button}>
						<Ionicons
							name="home-outline"
							size={20}
							color="#fff"
							style={styles.buttonIcon}
						/>
						<Text style={styles.buttonText}>
							{i18n.t(AUTHKEYS.GO_TO_HOME)}
						</Text>
					</Pressable>
				</Link>
			</View>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff", // White background
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	image: {
		width: 200,
		height: 200,
		marginBottom: 30,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#FF3B30", // Red text
		marginBottom: 10,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: "#777",
		textAlign: "center",
		marginBottom: 30,
		paddingHorizontal: 20,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FF3B30", // Red button
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 8,
		shadowColor: "#FF3B30",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonText: {
		color: "#fff", // White text
		fontSize: 16,
		fontWeight: "600",
	},
});
