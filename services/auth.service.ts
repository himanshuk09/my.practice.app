import api from "./api";
import { AUTHKEYS, LOCALSTORAGEKEYS } from "@/utils/messages";
import { AuthResponse, loginPayloadProps } from "@/types/auth.type";
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
			throw new Error(AUTHKEYS.INVALID_RESPONSE);
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
	} catch (error: any) {
		return {
			success: false,
			message: error.errorMessage,
			error:
				error instanceof Error ? error.message : JSON.stringify(error),
			status: error?.status,
		};
	}
};

// Logout function to clear token and user data
export const logout = async () => {
	try {
		// Remove token and user data from AsyncStorage
		await AsyncStorage.clear();
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			message: error.errorMessage,
			error:
				error instanceof Error ? error.message : JSON.stringify(error),
			status: error?.status,
		};
	}
};

export { loginUser };
