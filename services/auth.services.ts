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

const loginUser = async (payload: any) => {
	try {
		const response = await api.post("/token", {
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
	} catch (error: any) {
		return {
			success: false,
			message: "Authentication failed. Please check your credentials.",
			error: error.response ? error.response.data : error.message,
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
		// return [];
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
		await AsyncStorage.removeItem("authToken");
		await AsyncStorage.removeItem("user");
		return { success: true };
	} catch (error: any) {
		console.error("Logout error:", error.response || error.message);
		return { success: false, error: "Failed to log out" };
	}
};

export { loginUser, fetchDataByToggle };
