import api from "./api";
import { LOCALSTORAGEKEYS } from "@/utils/messages";
import { loginPayloadProps, AuthResponse } from "@/types/apiTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginUser = async (payload: loginPayloadProps) => {
	try {
		const response = await api.post<AuthResponse>("/token", {
			grant_type: "password",
			...payload,
		});

		const { access_token, UserId, cultureId, clientId, ApiApkVersion } =
			response?.data;

		if (!access_token || !UserId || !ApiApkVersion) {
			throw new Error("Invalid response data from login API.");
		}

		await AsyncStorage.multiSet([
			[LOCALSTORAGEKEYS.TOKEN, JSON.stringify(access_token)],
			[LOCALSTORAGEKEYS.USERID, UserId],
			[LOCALSTORAGEKEYS.APKVERSION, ApiApkVersion.toString()],
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
				error instanceof Error ? error.message : JSON.stringify(error),
		};
	}
};

// Logout function to clear token and user data
export const logout = async () => {
	try {
		// Remove token and user data from AsyncStorage
		await AsyncStorage.removeItem(LOCALSTORAGEKEYS.TOKEN);
		await AsyncStorage.removeItem(LOCALSTORAGEKEYS.USERID);
		return { success: true };
	} catch (error) {
		console.error(
			"Logout error:",
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		return { success: false, error: "Failed to log out" };
	}
};

export { loginUser };
