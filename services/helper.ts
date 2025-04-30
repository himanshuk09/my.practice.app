import { showToast } from "@/components/ToastConfig";
import NetInfo from "@react-native-community/netinfo";

export const checkInternetConnection = async (): Promise<boolean> => {
	try {
		const netInfo = await NetInfo.fetch();
		if (!netInfo.isConnected) {
			showToast({
				type: "download",
				title: "No_Internet_Connection",
				subtitle: "Waiting_for_reconnection",
				autoHide: false,
			});
			return false;
		}
		return true;
	} catch (error) {
		console.log("Error checking internet connection:", error);
		return false;
	}
};

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
