import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { NETWORKKEYS } from "@/utils/messages";
import { showToast } from "@/components/ToastConfig";
import NetInfo from "@react-native-community/netinfo";
import { setNetworkStatus } from "@/store/networkSlice";

const NetworkListener = () => {
	const dispatch = useDispatch();
	const wasConnected = useRef(true); // track previous state
	const retryNetworkCheck = async () => {
		const state = await NetInfo.fetch();
		const isConnected = !!state.isConnected;
		dispatch(setNetworkStatus(isConnected));
	};
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			const isConnected = !!state.isConnected;
			dispatch(setNetworkStatus(!!state.isConnected));

			// Only show/hide toast when connection state changes
			if (wasConnected.current !== isConnected) {
				wasConnected.current = isConnected;

				if (!isConnected) {
					showToast({
						type: "error",
						title: NETWORKKEYS.NO_INTERNET,
						subtitle: NETWORKKEYS.WAITING_FOR_CONNECTION,
						swipeable: false,
						autoHide: false,
						props: { network: true, onPress: retryNetworkCheck },
					});
				} else {
					Toast.hide();
				}
			}
		});
		return () => unsubscribe();
	}, [dispatch]);

	return null; // no UI, just listener
};

export default NetworkListener;
