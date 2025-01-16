import React from "react";
import { View } from "react-native";
import Loader from "@/components/Loader";
type AppLoaderProps = {
    children: React.ReactNode;
};
import { useSelector } from "react-redux";

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
    const isLoading = useSelector((state: any) => state?.navigation?.loading);

    return (
        <View style={{ flex: 1 }}>
            {isLoading && <Loader />}
            {children}
        </View>
    );
};

export default AppLoader;
