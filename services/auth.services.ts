import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { cockpitChartData } from "@/constants/cockpitchart";
import {
    filterByCurrentQuarterUTC,
    filterByMonthYearUTC,
    filterCurrentDayDataUTC,
    filterCurrentWeekDataUTC,
} from "@/components/Chart/filterFunction";

const loginUser = async (payload: any) => {
    try {
        let response = await api.post("/auth/login", payload);

        console.log("Login Successful:", response.data);
        if (response.data) {
            await AsyncStorage.setItem(
                "token",
                JSON.stringify(response?.data?.access_token)
            );
        }
        return response;
    } catch (err) {
        console.error("Login Failed", err);
        throw new Error("Login failed. Please try again.");
    }
};

const fetchData = async () => {
    try {
        const response = await api.get("/products");
        console.log("Data:", response.data);
    } catch (error: any) {
        // Errors are already handled by the interceptor, so this is optional
        console.error("Error fetching data:", error.message);
    }
};

const getProfileData = async () => {
    try {
        let response = await api.get("/auth/profile");
        console.log("Profile data:", response.data);
    } catch (err) {
        console.error("Error occurred", err);
    }
};

const fetchDataByToggle = async (tab: any) => {
    let response;
    if (tab === "Year") {
        return cockpitChartData;
    }
    if (tab === "Month") {
        return filterByMonthYearUTC();
    }
    if (tab === "Day") {
        return filterCurrentDayDataUTC();
    }
    if (tab === "Week") {
        return filterCurrentWeekDataUTC();
    }
    if (tab === "Quarter") {
        return filterByCurrentQuarterUTC();
    }
    if (tab === "Year_3") {
        return cockpitChartData;
    }
    return response;
};
export const login = async (email: any, password: any) => {
    try {
        const response = await api.post("/login", { email, password });
        const { token, user } = response.data; // Assuming the API returns a token and user data

        // Store the token and user data in AsyncStorage
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        return { success: true, user };
    } catch (error: any) {
        console.error("Login error:", error.response || error.message);
        return {
            success: false,
            error: error.response?.data?.message || "Something went wrong",
        };
    }
};

// Logout function to clear token and user data
export const logout = async () => {
    try {
        // Remove token and user data from AsyncStorage
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("user");
        return { success: true };
    } catch (error: any) {
        console.error("Logout error:", error.response || error.message);
        return { success: false, error: "Failed to log out" };
    }
};

// Get the currently authenticated user
export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
        return null;
    } catch (error: any) {
        console.error("Error fetching user:", error.response || error.message);
        return null;
    }
};

// Function to check if the user is logged in
export const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem("authToken");
    return token !== null;
};
export { fetchData, getProfileData, loginUser, fetchDataByToggle };
