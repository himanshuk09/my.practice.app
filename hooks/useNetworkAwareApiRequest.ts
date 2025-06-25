import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { AUTHKEYS, NETWORKKEYS } from "@/utils/messages";
import { useCallback, useEffect, useState } from "react";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";

interface UseNetworkAwareApiRequestOptions<P = any> {
	autoFetch?: boolean; // automatically call API on mount
	enabled?: boolean; // conditionally enable API call
	params?: P; // parameters for the API function
	deps?: any[]; // custom dependencies to watch for refetch
	showGlobalLoader?: boolean; // trigger Redux loader actions
}

interface UseNetworkAwareApiRequestResult<T> {
	data: T | null | any;
	loading: boolean;
	error: string | null;
	refetch: () => void;
	isOnline: boolean;
}

export function useNetworkAwareApiRequest<T = any, P = any>(
	apiFunction: (params?: P) => Promise<T>,
	options: UseNetworkAwareApiRequestOptions<P> = {}
): UseNetworkAwareApiRequestResult<T> {
	const dispatch = useDispatch();
	const isOnline = useSelector(
		(state: RootState) => state.network.isConnected
	);

	const {
		autoFetch = false,
		enabled = false,
		params,
		deps = [],
		showGlobalLoader = false,
	} = options;

	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchApiData = useCallback(async () => {
		// If offline and no data, show error and exit
		if (!isOnline && !data) {
			setError(NETWORKKEYS.NO_INTERNET);
			return;
		}

		// If offline but data exists, do not refetch or reset
		if (!isOnline && data) {
			setError(null); // clear any previous error
			return;
		}

		setLoading(true);
		setError(null);
		if (showGlobalLoader) dispatch(activeLoading());

		try {
			const response = await apiFunction(params);
			const isEqual = JSON.stringify(response) === JSON.stringify(data);

			if (!isEqual) {
				setData(response);
			}
		} catch (err: any) {
			const errorMsg = err?.message || AUTHKEYS.UNKNOWN_ERROR;
			console.error("API Request Error:", errorMsg);
			setError(errorMsg);
		} finally {
			setLoading(false);
			if (showGlobalLoader) dispatch(inActiveLoading());
		}
	}, [apiFunction, params, isOnline]);

	useEffect(() => {
		if (enabled && autoFetch) {
			fetchApiData();
		}
	}, [isOnline, autoFetch, enabled, ...deps]);

	return {
		data,
		loading,
		error,
		refetch: fetchApiData,
		isOnline,
	};
}
