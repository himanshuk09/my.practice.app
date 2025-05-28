import { useCallback } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

function setCookie(key: string, value: string, days = 7) {
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(key: string): string | null {
	const match = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
	return match ? decodeURIComponent(match.pop() as string) : null;
}

function deleteCookie(key: string) {
	document.cookie = `${key}=; Max-Age=0; path=/`;
}

type UseSecureStorage = {
	setItem: (key: string, value: string) => Promise<void>;
	getItem: (key: string) => Promise<string | null>;
	deleteItem: (key: string) => Promise<void>;
};

export function useSecureStorage(): UseSecureStorage {
	const setItem = useCallback(
		async (key: string, value: string): Promise<void> => {
			if (Platform.OS === "web") {
				setCookie(key, value);
			} else {
				await SecureStore.setItemAsync(key, value);
			}
		},
		[]
	);

	const getItem = useCallback(async (key: string): Promise<string | null> => {
		if (Platform.OS === "web") {
			return getCookie(key);
		} else {
			return await SecureStore.getItemAsync(key);
		}
	}, []);

	const deleteItem = useCallback(async (key: string): Promise<void> => {
		if (Platform.OS === "web") {
			deleteCookie(key);
		} else {
			await SecureStore.deleteItemAsync(key);
		}
	}, []);

	return { setItem, getItem, deleteItem };
}
