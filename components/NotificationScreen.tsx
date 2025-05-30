import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
	Switch,
} from "react-native";
import * as Notifications from "expo-notifications";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
	cancelAllScheduledNotifications,
	getCurrentPushToken,
	scheduleNotification,
	sendMultipleNotificationUsingTokens,
	sendNotificationUsingToken,
} from "@/components/services/notificationService";

export default function NotificationScreen() {
	const [token, setToken] = useState("");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [data, setData] = useState("");
	const [expoPushToken, setExpoPushToken] = useState("");
	const [isScheduled, setIsScheduled] = useState(false);
	const [delayValue, setDelayValue] = useState("5");
	const [isMinutes, setIsMinutes] = useState(false);
	const [shouldRepeat, setShouldRepeat] = useState(false);
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(inActiveLoading());
		const currentToken: any = getCurrentPushToken();
		setExpoPushToken(currentToken);
		setToken(currentToken);
	}, [isScheduled, isFocused]);
	const handleMultipleSendNotification = async () => {
		if (!token) {
			Alert.alert("Error", "Token field is required");
			return;
		}

		// Split and clean tokens
		const tokens = token
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		// Validate token list
		if (tokens.length === 0) {
			Alert.alert("Error", "Please provide at least one valid token");
			return;
		}

		// Prepare notifications array
		const notifications: any = tokens.map((tok) => ({
			to: tok,
			title: title,
			body: body,
			categoryIdentifier: "message_category",
			categoryId: "message_category",
			data: data ? JSON.parse(data) : {},
		}));

		try {
			if (isScheduled) {
				const delaySeconds = isMinutes
					? parseFloat(delayValue) * 60
					: parseFloat(delayValue);

				if (isNaN(delaySeconds) || delaySeconds <= 0) {
					Alert.alert(
						"Error",
						"Please enter a valid positive number"
					);
					return;
				}

				const trigger: Notifications.TimeIntervalTriggerInput = {
					seconds: delaySeconds,
					repeats: shouldRepeat,
					type: Notifications.SchedulableTriggerInputTypes
						.TIME_INTERVAL,
				};

				// Only schedule for the first token, as scheduling local notifications works on device
				scheduleNotification(notifications[0], trigger);
				Alert.alert(
					"Success",
					`Notification scheduled for ${delayValue} ${
						isMinutes ? "minutes" : "seconds"
					}`
				);
			} else {
				// Send push notifications via Expo to multiple tokens
				sendMultipleNotificationUsingTokens(notifications);
				Alert.alert("Success", "Notifications sent successfully :) !");
			}
		} catch (error) {
			Alert.alert(
				"Error",
				`Failed to ${isScheduled ? "schedule" : "send"} notification`
			);
		}
	};

	const handleSendNotification = async () => {
		if (!token) {
			Alert.alert("Error", "Token field is required");
			return;
		}

		const notificationContent = {
			to: token,
			title: title,
			body: body,
			data: data ? JSON.parse(data) : {},
		};

		try {
			if (isScheduled) {
				const delaySeconds = isMinutes
					? parseFloat(delayValue) * 60
					: parseFloat(delayValue);

				if (isNaN(delaySeconds) || delaySeconds <= 0) {
					Alert.alert(
						"Error",
						"Please enter a valid positive number"
					);
					return;
				}
				const trigger: Notifications.TimeIntervalTriggerInput = {
					seconds: delaySeconds,
					repeats: shouldRepeat,
					type: Notifications.SchedulableTriggerInputTypes
						.TIME_INTERVAL,
				};
				scheduleNotification(notificationContent, trigger);
				Alert.alert(
					"Success",
					`Notification scheduled for ${delayValue} ${
						isMinutes ? "minutes" : "seconds"
					}`
				);
			} else {
				sendNotificationUsingToken(notificationContent);
				Alert.alert("Success", "Notification sent successfully :) !");
			}
		} catch (error) {
			Alert.alert(
				"Error",
				`Failed to ${isScheduled ? "schedule" : "send"} notification`
			);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.header}>Send a notification</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Token *</Text>
				<TextInput
					style={styles.input}
					placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
					value={token || expoPushToken}
					onChangeText={setToken}
					placeholderTextColor="#999"
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					placeholder="Notification title"
					value={title}
					onChangeText={setTitle}
					placeholderTextColor="#999"
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Body</Text>
				<TextInput
					style={styles.input}
					placeholder="Notification message"
					value={body}
					onChangeText={setBody}
					placeholderTextColor="#999"
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Data (JSON)</Text>
				<TextInput
					style={[styles.input, styles.multilineInput]}
					value={data}
					onChangeText={setData}
					multiline
					placeholderTextColor="#999"
				/>
			</View>

			<View style={styles.switchContainer}>
				<Text style={styles.label}>Schedule Notification</Text>
				<Switch
					value={isScheduled}
					onValueChange={setIsScheduled}
					trackColor={{ false: "#767577", true: "#4630EB" }}
					thumbColor={isScheduled ? "#f4f3f4" : "#f4f3f4"}
				/>
			</View>

			{isScheduled && (
				<View style={styles.scheduleContainer}>
					<View style={styles.delayInputContainer}>
						<TextInput
							style={[styles.input, styles.delayInput]}
							placeholder="5"
							value={delayValue}
							onChangeText={setDelayValue}
							keyboardType="numeric"
							placeholderTextColor="#999"
						/>
						<View style={styles.unitSwitchContainer}>
							<Text style={styles.unitText}>
								{isMinutes ? "Minutes" : "Seconds"}
							</Text>
							<Switch
								value={isMinutes}
								onValueChange={setIsMinutes}
								trackColor={{
									false: "#767577",
									true: "#4630EB",
								}}
								thumbColor={isMinutes ? "#f4f3f4" : "#f4f3f4"}
							/>
						</View>
					</View>

					<View style={[styles.switchContainer, { marginTop: 10 }]}>
						<Text style={styles.label}>Repeat Notification</Text>
						<Switch
							value={shouldRepeat}
							onValueChange={setShouldRepeat}
							trackColor={{
								false: "#767577",
								true: "#4630EB",
							}}
							thumbColor={shouldRepeat ? "#f4f3f4" : "#f4f3f4"}
						/>
					</View>
				</View>
			)}

			<TouchableOpacity
				style={styles.button}
				// onPress={handleSendNotification}
				onPress={handleMultipleSendNotification}
			>
				<Text style={styles.buttonText}>
					{isScheduled
						? "Schedule Notification"
						: "Send Notification"}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={cancelAllScheduledNotifications}
			>
				<Text style={styles.buttonText}>Clear Notification</Text>
			</TouchableOpacity>
			<View style={styles.tokenContainer}>
				<Text style={styles.label}>Your Expo Push Token:</Text>
				<Text style={styles.tokenText}>{expoPushToken}</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#4630EB",
	},
	inputContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 4,
		padding: 10,
		fontSize: 16,
		backgroundColor: "#f9f9f9",
	},
	multilineInput: {
		minHeight: 80,
		textAlignVertical: "top",
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	scheduleContainer: {
		marginBottom: 15,
	},
	delayInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
	},
	delayInput: {
		flex: 1,
		marginRight: 10,
	},
	unitSwitchContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	unitText: {
		marginRight: 8,
		fontSize: 14,
	},
	button: {
		backgroundColor: "#4630EB",
		padding: 15,
		borderRadius: 4,
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	tokenContainer: {
		marginTop: 30,
		padding: 15,
		backgroundColor: "#f0f0f0",
		borderRadius: 4,
	},
	// tokenText: {
	// 	marginTop: 5,
	// 	fontSize: 14,
	// 	color: "#666",
	// },
	tokenHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	copyButton: {
		backgroundColor: "#4630EB",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	copyButtonText: {
		color: "white",
		fontSize: 12,
	},
	tokenText: {
		fontSize: 14,
		color: "#666",
		padding: 8,
		backgroundColor: "#f5f5f5",
		borderRadius: 4,
	},
});
