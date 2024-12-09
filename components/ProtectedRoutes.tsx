import { useEffect } from "react";

import { usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const getLoginDetails = async () => {
    try {
      const value = await AsyncStorage.getItem("userlogin");
      if (value !== null && value == "true") {
        console.log("Login", true);
      } else {
        if (pathname != "/login/forgotpassword") router.replace("/");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getLoginDetails();
  });
  return children;
};

export default ProtectedRoute;
