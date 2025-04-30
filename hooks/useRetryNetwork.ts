import NetInfo from "@react-native-community/netinfo";
import { setNetworkStatus } from "@/store/networkSlice";
import { useDispatch } from "react-redux";

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
