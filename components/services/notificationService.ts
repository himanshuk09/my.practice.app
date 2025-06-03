import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as TaskManager from "expo-task-manager";
import { router } from "expo-router";

/**
 * State variables
 */
let expoPushToken: string | null = null;
let currentNotification: Notifications.Notification | null = null;
let notificationError: Error | null | any = null;
null;
// constants
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

/**
 * Background task setup
 */
TaskManager.defineTask<Notifications.NotificationResponse>(
	BACKGROUND_NOTIFICATION_TASK,
	async ({ data, error, executionInfo }) => {
		try {
			// console.log(
			// 	"🔔 Received a notification in the background!",
			// 	JSON.stringify(
			// 		{
			// 			data,
			// 			error,
			// 			executionInfo,
			// 		},
			// 		null,
			// 		2
			// 	)
			// );
			return Promise.resolve();
		} catch (e) {
			return Promise.reject(e);
		}
	}
);

/**
 * Notification categories configuration
 */
const categories = [
	{
		id: "message_category",
		actions: [
			{
				identifier: "REPLY",
				buttonTitle: "Reply",
				textInput: {
					submitButtonTitle: "Send",
					placeholder: "Type a reply...",
				},
			},
			{ identifier: "MARK_AS_READ", buttonTitle: "Mark as Read" },
		],
	},
	{
		id: "email_actions",
		actions: [
			{
				identifier: "BUSY",
				buttonTitle: "Tell them I'm busy right now 😴",
			},
			{
				buttonTitle: "Write a custom response 📝",
				identifier: "REPLY",
				textInput: {
					submitButtonTitle: "Send it ✉️",
					placeholder: "Hm.. what to write?",
				},
				options: {
					// This allows to retrieve NotificationResponse.userText
					opensAppToForeground: false,
				},
			},
			{
				identifier: "DELETE",
				buttonTitle: "Delete that email 🧞",
				options: {
					isAuthenticationRequired: false,
					isDestructive: true,
					opensAppToForeground: true,
				},
			},
		],
	},
	{
		id: "customActions",
		actions: [
			{
				identifier: "VIEW_ACTION",
				buttonTitle: "View",
				options: { opensAppToForeground: true },
			},
			{
				identifier: "IGNORE_ACTION",
				buttonTitle: "Ignore",
				options: { isDestructive: true },
			},
		],
	},
];

/**
 * Initialize notification handler
 */
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

/**
 * Listeners
 */
const notificationListener = Notifications.addNotificationReceivedListener(
	(notification) => {
		// console.log(
		// 	"🔔 Notification Received: ",
		// 	JSON.stringify(notification, null, 2)
		// );
		currentNotification = notification;
	}
);

const responseListener = Notifications.addNotificationResponseReceivedListener(
	async (response) => {
		try {
			console.log(
				"🔔Notification Response:User interact",
				JSON.stringify(response, null, 2)
			);
			const { actionIdentifier, notification } = response;
			const notificationId = notification.request.identifier;

			if (
				actionIdentifier === "DELETE" ||
				actionIdentifier === "IGNORE_ACTION" ||
				actionIdentifier === "MARK_AS_READ"
			) {
				console.log("Delete button pressed", notificationId);
				await Notifications.dismissNotificationAsync(notificationId); // 👈 dismiss it manually
			}

			if (actionIdentifier === "REPLY") {
				const userInput =
					response.userText ??
					response.notification.request.content.data?.userText ??
					null;
				console.log("User input:", userInput, notificationId);
				await Notifications.dismissNotificationAsync(notificationId); // 👈 dismiss it manually
			}

			const url: any = response.notification.request.content.data?.url;
			if (url) router.push(url);
		} catch (error) {
			notificationError = error;
		}
	}
);

/**
 * Initialize function (call this when your app starts)
 */
export const initializeNotifications = async () => {
	try {
		await registerForPushNotificationsAsync();
		await setupNotificationCategories();
		Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
	} catch (error) {
		notificationError = error;
	}
};

/**
 *  Cleanup function (call this when your app is closing)
 */
export const cleanupNotificationListeners = () => {
	notificationListener.remove();
	responseListener.remove();
};

export const setupNotificationCategories = async () => {
	await Promise.all(
		categories.map(({ id, actions }) =>
			Notifications.setNotificationCategoryAsync(id, actions)
		)
	);
};

/**
 * Check the permission / device and then give expoPushToken
 * @returns expoPushToken
 */
export const registerForPushNotificationsAsync = async () => {
	try {
		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.HIGH,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } =
					await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			if (finalStatus !== "granted") {
				throw new Error(
					"Permission not granted to get push token for push notification!"
				);
			}

			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;
			if (!projectId) {
				throw new Error("Project ID not found");
			}

			try {
				const pushTokenString = (
					await Notifications.getExpoPushTokenAsync({ projectId })
				).data;
				expoPushToken = pushTokenString;
				console.log("expoPushToken", expoPushToken);
				return pushTokenString;
			} catch (e: unknown) {
				notificationError = e;
			}
		} else {
			notificationError =
				"Must use physical device for push notifications";
		}
	} catch (error) {
		notificationError = error;
	}
};

/**
 * Schedule Notification
 * @param content
 * @param trigger
 * @returns
 */
export const scheduleNotification = async (
	content: Notifications.NotificationContentInput & {
		to?: string;
	} = {
		to: "",
		title: "",
		body: "",
		data: {},
	},
	trigger: Notifications.NotificationTriggerInput = {
		seconds: 0,
		repeats: false,
		type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
	}
): Promise<string | null> => {
	try {
		return await Notifications.scheduleNotificationAsync({
			content,
			trigger,
		});
	} catch (err) {
		notificationError = "Error scheduling notification:" + err;
		return null;
	}
};

/**
 *  Cancel the Schedule Notification by identifier
 * @param identifier
 */
export const cancelScheduledNotification = async (identifier: string) => {
	try {
		await Notifications.cancelScheduledNotificationAsync(identifier);
	} catch (error) {
		notificationError = error;
	}
};

/**
 * Cancel All Schedule Notification
 */
export const cancelAllScheduledNotifications = async () => {
	try {
		await Notifications.cancelAllScheduledNotificationsAsync();
	} catch (error) {
		notificationError = error;
	}
};

/**
 * Get All Scheduled Notifications
 * @returns
 */
export const getAllScheduledNotifications = async () => {
	try {
		return await Notifications.getAllScheduledNotificationsAsync();
	} catch (error) {
		notificationError = error;
		return null;
	}
};

/**
 * Send Notification by Getting expoPushToken
 * @param notificationContent
 * @returns
 */
export const sendNotificationUsingToken = async (notificationContent: {
	to?: any;
	title?: string | null;
	subtitle?: string | null;
	categoryIdentifier?: string | null;
	body?: string | null;
	data?: undefined;
	sound?: "default" | "defaultCritical" | "custom" | null;
}) => {
	try {
		const response = await fetch(
			// "https://api.expo.dev/v2/push/send",
			"https://exp.host/--/api/v2/push/send",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Accept-encoding": "gzip, deflate",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(notificationContent),
			}
		);

		const result = await response.json();
		return result;
	} catch (error) {
		notificationError = error;
		return null;
	}
};

/**
 * Send Notification to Multiple User By Getting the Array Of expoPushToken
 * @param notificationContent
 * @returns
 */
export const sendMultipleNotificationUsingTokens = async (
	notificationContent: (Notifications.NotificationContentInput & {
		to?: string;
	})[]
) => {
	try {
		const response = await fetch(
			// "https://api.expo.dev/v2/push/send",
			"https://exp.host/--/api/v2/push/send",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Accept-encoding": "gzip, deflate",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(notificationContent),
			}
		);

		const result = await response.json();
		return result;
	} catch (error) {
		notificationError = error;
		return null;
	}
};

/**
 * Getter
 */
export const getCurrentPushToken = () => expoPushToken;
export const getCurrentNotification = () => currentNotification;
export const getError = () => notificationError;
