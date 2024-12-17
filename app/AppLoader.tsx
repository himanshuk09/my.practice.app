import React from "react";
import { View } from "react-native";
import { usePathname } from "expo-router";
import Loader from "@/components/Loader";
type AppLoaderProps = {
  children: React.ReactNode;
};
import { useSelector } from "react-redux";

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const isLoading = useSelector((state: any) => state?.navigation?.loading);
  const pathname = usePathname();
  const skipLoadingPaths = ["/", "/login", "/login/forgotpassword"];
  //&& !skipLoadingPaths.includes(pathname)
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loader />}
      {children}
    </View>
  );
};

export default AppLoader;
