import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import axios from "axios";
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
export { fetchData, getProfileData, loginUser, fetchDataByToggle };
