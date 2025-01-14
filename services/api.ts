import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
const url = "https://api.escuelajs.co/api/v1";
const api = axios.create({
    baseURL: url,
});

const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    // If there's no token , return null
    if (!token) {
        return;
    }
    return token;
};

api.interceptors.request.use(async (config) => {
    let token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // 401 indicates token is invalid (expired or not matching)
            console.warn("Token expired or unauthorized");
            await AsyncStorage.removeItem("token"); // Clear token
            // router.replace("/"); // Redirect to login screen
        } else if (error.response && error.response.status === 403) {
            // 403 indicates insufficient permissions
            console.error(
                "Access Denied: You do not have permission to perform this action."
            );
        } else {
            // Handle other errors (network issues, etc.)
            console.error("API Error:", error.message);
        }
        return Promise.reject(error); // Pass error to the calling code
    }
);
export { getToken };
export default api;
