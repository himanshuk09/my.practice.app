import * as SecureStore from "expo-secure-store";

export async function saveSecureStore(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
}
export async function getSecureStore(key: any) {
    return await SecureStore.getItemAsync(key);
}
export const deleteSecureStoreKey = async (key: any) => {
    await SecureStore.deleteItemAsync(key);
};
