import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

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
				// Show persistent toast when offline
				Toast.show({
					type: "error", // Change "download" to "error" for clarity
					text1: "No Internet Connection",
					text2: "Waiting for reconnection...",
					autoHide: false, // Keeps toast visible until connection is restored
					position: "bottom",
					bottomOffset: 20,
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
