import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { LOCALSTORAGEKEYS, NETWORKKEYS, ROUTEKEYS } from "@/utils/messages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection, getErrorMessageFromStatus } from "./helper";

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

// Queue for storing API requests
api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const isConnected = await checkInternetConnection();
		if (!isConnected) {
			// Optionally throw a custom error here
			throw new AxiosError(NETWORKKEYS.NO_INTERNET, "ERR_NETWORK");
		}

		let token = await AsyncStorage.getItem(LOCALSTORAGEKEYS.TOKEN);
		let UserId = await AsyncStorage.getItem(LOCALSTORAGEKEYS.USERID);
		let ApkVersion = await AsyncStorage.getItem(
			LOCALSTORAGEKEYS.APKVERSION
		);

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
// Queue for storing API response
api.interceptors.response.use(
	(response) => response,
	async (error: any) => {
		if (error.response && error.response.status === 401) {
			// 401 indicates token is invalid (expired or not matching) Token expired or Unauthorized
			await AsyncStorage.removeItem(LOCALSTORAGEKEYS.TOKEN); // Clear token
			router.replace(ROUTEKEYS.LOGIN); // Redirect to login screen
		}

		error.errorMessage = await getErrorMessageFromStatus(
			error.response.status,
			error
		);
		return Promise.reject(error); // Pass error to the calling code
	}
);

export default api;
