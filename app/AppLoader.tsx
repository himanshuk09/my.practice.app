import React from "react";
import { View } from "react-native";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
type AppLoaderProps = {
    children: React.ReactNode;
};

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
    const isLoading = useSelector(
        (state: RootState) => state?.navigation?.loading
    );

    return (
        <View style={{ flex: 1 }}>
            {isLoading && <Loader />}
            {children}
        </View>
    );
};

export default AppLoader;
