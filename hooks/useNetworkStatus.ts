import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "@/components/ToastConfig";
import { NETWORKKEYS } from "@/utils/messages";

/**
 * Custom hook to track internet connectivity status.
 * - Displays a persistent toast when offline.
 * - Hides the toast when the internet is restored.
 * @returns {boolean} isOnline - Indicates if the device is connected to the internet.
 */
const useNetworkStatus = (): boolean => {
	const [isOnline, setIsOnline] = useState(false);

	useEffect(() => {
		// Subscribe to network state changes
		const unsubscribe = NetInfo.addEventListener((networkState) => {
			const onlineStatus = networkState.isConnected ?? false;
			setIsOnline(onlineStatus);

			if (!onlineStatus) {
				showToast({
					type: "error",
					title: NETWORKKEYS.NO_INTERNET,
					subtitle: NETWORKKEYS.WAITING_FOR_CONNECTION,
					autoHide: false,
					props: { network: true },
				});
			} else {
				// Hide the toast when back online
				Toast.hide();
			}
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	return isOnline;
};

export default useNetworkStatus;
