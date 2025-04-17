import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Page Not Found" }} />
			<View style={styles.container}>
				{/* Replace the require path with your image asset if necessary */}
				<Image
					source={require("@/assets/images/404-error.png")}
					style={styles.image}
					resizeMode="contain"
				/>

				<Text style={styles.title}>Oops! Page not found</Text>
				<Text style={styles.subtitle}>
					The page you’re looking for doesn’t exist or has been moved.
				</Text>

				<Link href="/" asChild>
					<Pressable style={styles.button}>
						<Ionicons
							name="home-outline"
							size={20}
							color="#fff"
							style={styles.buttonIcon}
						/>
						<Text style={styles.buttonText}>Go to Home</Text>
					</Pressable>
				</Link>
			</View>
		</>
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
