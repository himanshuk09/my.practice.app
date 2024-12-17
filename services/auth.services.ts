import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const loginUser = async (payload: any) => {
  try {
    let response = await api.post("/auth/login", payload);

    console.log("Login Successful:", response.data);
    if (response.data) {
      await AsyncStorage.setItem(
        "token",
        JSON.stringify(response.data.access_token)
      );
    }
    return response.data;
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

export { fetchData, getProfileData, loginUser };
