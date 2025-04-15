import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { cockpitChartData } from "@/constants/cockpitchart";
import {
	filterByCurrentQuarterUTC,
	filterByMonthYearUTC,
	filterCurrentDayDataUTC,
	filterCurrentWeekDataUTC,
} from "@/components/Chart/filterFunction";
import { stringChartData } from "@/constants/stringChartData";
import { loginPayloadProps, AuthResponse } from "@/types/apiTypes";


const loginUser = async (payload: loginPayloadProps) => {
	try {
		const response = await api.post<AuthResponse>("/token", {
			grant_type: "password",
			...payload,
		});

		const { access_token, UserId, cultureId, clientId, ApiApkVersion } =
			response?.data;

		// Store token
		await AsyncStorage.multiSet([
			["token", JSON.stringify(access_token)],
			["UserId", UserId],
			["ApkVersion", ApiApkVersion],
		]);
		return {
			success: true,
			message: "Login Successful",
			token: access_token,
			clientId,
		};
	} catch (error) {
		return {
			success: false,
			message: "Authentication failed. Please check your credentials.",
			error:
				error instanceof Error
					? error.message
					: JSON.stringify(error),
		};
	}
};

const fetchDataByToggle = async (tab: any) => {
	let response;
	if (tab === "Year") {
		return cockpitChartData;
	}
	if (tab === "Month") {
		return filterByMonthYearUTC();
	}
	if (tab === "Day") {
		return [];
		return filterCurrentDayDataUTC();
	}
	if (tab === "Week") {
		return filterCurrentWeekDataUTC();
	}
	if (tab === "Quarter") {
		return stringChartData;
		return filterByCurrentQuarterUTC();
	}
	if (tab === "Year_3") {
		return cockpitChartData;
	}
	return response;
};

// Logout function to clear token and user data
export const logout = async () => {
	try {
		// Remove token and user data from AsyncStorage
		await AsyncStorage.removeItem("token");
		await AsyncStorage.removeItem("user");
		return { success: true };
	} catch (error) {
		console.error(
			"Logout error:",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return { success: false, error: "Failed to log out" };
	}
};

export { loginUser, fetchDataByToggle };
