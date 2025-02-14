import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_BASE_URL,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
	transformRequest: [
		(data) => {
			return new URLSearchParams(data).toString();
		},
	],
});

api.interceptors.request.use(
	async (config) => {
		let token = await AsyncStorage.getItem("token");
		let UserId = await AsyncStorage.getItem("UserId");
		let ApkVersion = await AsyncStorage.getItem("ApkVersion");

		if (token) {
			config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
			config.headers.UserId = UserId;
			config.headers.ApkVersion = ApkVersion;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response && error.response.status === 401) {
			// 401 indicates token is invalid (expired or not matching)
			console.log(
				"Token expired or Unauthorized, please log in again"
			);
			await AsyncStorage.removeItem("token"); // Clear token
			router.replace("/"); // Redirect to login screen
		} else if (error.response && error.response.status === 403) {
			// 403 indicates insufficient permissions
			console.log(
				"Access Denied: You do not have permission to perform this action."
			);
		} else if (error.response && error.response.status === 500) {
			console.log("Server error, please try again later");
		} else {
			// Handle other errors (network issues, etc.)
			console.log("API Error:", error.message);
		}
		return Promise.reject(error); // Pass error to the calling code
	}
);

export const formateByEnergyType = (data: any[] = []) => {
	return data.reduce(
		(acc, item) => {
			if (item.EnergyType === 1) {
				acc.strom.push(item);
			} else if (item.EnergyType === 2 || item.EnergyType === 5) {
				acc.gas.push(item);
			}
			return acc;
		},
		{ gas: [] as any[], strom: [] as any[] }
	);
};

export default api;
