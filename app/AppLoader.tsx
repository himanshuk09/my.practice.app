import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { usePathname, useRouter, useSegments } from "expo-router";
import Loader from "@/components/Loader";
type AppLoaderProps = {
  children: React.ReactNode;
};

import { useDispatch, useSelector } from "react-redux";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const isLoading = useSelector((state: any) => state?.navigation?.loading);
  const dispatch = useDispatch();
  const pathname = usePathname();
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(inActiveLoading());
    }, 500);
    return () => clearTimeout(timeout);
  }, [pathname, dispatch]);

  const skipLoadingPaths = ["/", "/login", "/login/forgotpassword"];
  return (
    <View style={{ flex: 1 }}>
      {isLoading && !skipLoadingPaths.includes(pathname) && <Loader />}
      {children}
    </View>
  );
};

export default AppLoader;

// const [isLoading, setIsLoading] = useState(true);
// const pathname = usePathname(); // Gets the current route's path
// useEffect(() => {
//   setIsLoading(true);
//   const timeout = setTimeout(() => {
//     setIsLoading(false);
//   }, 1000);
//   return () => clearTimeout(timeout);
// }, [pathname]);
