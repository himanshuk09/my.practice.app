import { useDispatch } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { setNetworkStatus } from "@/store/networkSlice";

const useRetryNetwork = () => {
	const dispatch = useDispatch();

	const retryNetworkCheck = async () => {
		const state = await NetInfo.fetch();
		const isConnected = !!state.isConnected;
		dispatch(setNetworkStatus(isConnected));
	};

	return retryNetworkCheck;
};
export default useRetryNetwork;
