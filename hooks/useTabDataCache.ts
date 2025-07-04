// useTabDataCache.ts

import { RootState } from "@/store/store";
import { tabsType, TimeFrame } from "@/types/chart.type";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const useTabDataCache = () => {
	const cacheRef = useRef<Record<string, any>>({});
	const pendingRequestsRef: any = useRef<Record<string, Promise<any>>>({});
	const isMountedRef = useRef(true);
	const isOnline = useSelector(
		(state: RootState) => state.network.isConnected
	);
	// Special keys
	const CUSTOM_TAB_KEY = "__custom__";
	const EMPTY_TAB_KEY = "__empty__";

	const normalizeTabKey = (tab: string | number): string => {
		if (tab === "") return EMPTY_TAB_KEY;
		return String(tab);
	};

	const fetchWithCache = async (
		payload: { TimeFrame?: TimeFrame | tabsType } & Record<string, any>,
		fetchFn: (payload: any) => Promise<any>,
		options?: {
			customCacheKey?: string;
			forceRefresh?: boolean;
		}
	): Promise<any> => {
		const tab = payload?.TimeFrame ?? "";
		const cacheKey = options?.customCacheKey ?? normalizeTabKey(tab);

		// Special case: Always call API when TimeFrame is 6
		const isCustomTab = payload?.TimeFrame === 6;

		// Only check cache if not the custom tab and not forcing refresh
		// if Already call Api For this tab then get the data from cache and return
		if (
			!isCustomTab &&
			!options?.forceRefresh &&
			cacheRef.current[cacheKey] !== undefined
		) {
			return cacheRef.current[cacheKey];
		}

		// Return pending promise if request is in progress (even for custom tab)
		if (pendingRequestsRef.current[cacheKey]) {
			return pendingRequestsRef.current[cacheKey];
		}

		try {
			if (!isOnline) {
				return;
			}

			const requestPromise = fetchFn(payload);

			pendingRequestsRef.current[cacheKey] = requestPromise;

			const response = await requestPromise;

			if (isMountedRef.current) {
				// Only cache if not the custom tab
				if (!isCustomTab) {
					cacheRef.current[cacheKey] = response;
				}
				delete pendingRequestsRef.current[cacheKey];
			}

			return response;
		} catch (error) {
			console.error(`Error fetching data for key "${cacheKey}":`, error);
			if (isMountedRef.current) {
				delete pendingRequestsRef.current[cacheKey];
			}
			return null;
		}
	};

	const clearCache = (cacheKey?: string) => {
		if (isMountedRef.current) {
			if (cacheKey !== undefined) {
				delete cacheRef.current[cacheKey];
			} else {
				cacheRef.current = {};
			}
		}
	};

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
			cacheRef.current = {};
			pendingRequestsRef.current = {};
		};
	}, []);
	return {
		fetchWithCache,
		clearCache,
		getCache: () => cacheRef.current,
		CUSTOM_TAB_KEY,
		EMPTY_TAB_KEY,
	};
};

export default useTabDataCache;
