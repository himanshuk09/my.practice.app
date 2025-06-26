import { AUTHKEYS, NETWORKKEYS } from "@/utils/messages";
import { showToast } from "@/components/ToastConfig";
import NetInfo from "@react-native-community/netinfo";

export const checkInternetConnection = async (): Promise<boolean> => {
	try {
		const netInfo = await NetInfo.fetch();
		if (!netInfo.isConnected) {
			showToast({
				type: "error",
				title: NETWORKKEYS.NO_INTERNET,
				subtitle: NETWORKKEYS.WAITING_FOR_CONNECTION,
				autoHide: false,
			});
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
};

export const formateByEnergyType = (data: any[] = []) => {
	if (!Array.isArray(data) || data.length === 0) {
		return {
			success: false,
			gas: [],
			strom: [],
		};
	}

	const result = data.reduce(
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

	return {
		success: result.gas.length > 0 || result.strom.length > 0,
		...result,
	};
};

export function getErrorMessageFromStatus(
	status?: number,
	error?: unknown
): string {
	if (!status) {
		if ((error as Error)?.message === "Network Error") {
			return NETWORKKEYS.NETWORK_ERROR;
		}
		return AUTHKEYS.UNKNOWN_ERROR;
	}

	switch (status) {
		case 400: //  Bad Request — usually validation failed
			return AUTHKEYS.FAILURE;
		case 401: //  Unauthorized — typically session expired or no token
			return AUTHKEYS.SESSION_EXPIRED;
		case 403: //  Forbidden — token is valid but user lacks permission
			return AUTHKEYS.PERMISSION_NOT_GRANTED;
		case 408: //  Request Timeout
			return AUTHKEYS.REQUEST_TIMEOUT;
		case 429: //Too Many Requests — rate-limiting
			return AUTHKEYS.TOO_MANY_REQUEST;
		case 500: // Internal Server Error — backend bug or crash
			return AUTHKEYS.SOMETHING_WORNG;
		//  These all typically indicate server/service unavailability
		case 404:
		case 502:
		case 503:
		case 504:
			return AUTHKEYS.SERVICE_UNAVAILABLE;

		default:
			return AUTHKEYS.UNKNOWN_ERROR;
	}
}
