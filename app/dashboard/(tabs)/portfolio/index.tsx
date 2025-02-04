import React, { useEffect, useState } from "react";
import { gasItems, powerItems } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { Platform, SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
const Portfolio: React.FC = () => {
    const [gasData, setGasData] = useState<any>([]);
    const [powerData, setPowerData] = useState<any>([]);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let NavigateTo = "dashboard/portfolio";
    useEffect(() => {
        const fetchData = async () => {
            try {
                setTimeout(() => {
                    setGasData(gasItems);
                    setPowerData(powerItems);
                }, 1000);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        dispatch(inActiveLoading());
        fetchData();
    }, [isFocused]);

    return (
        <SafeAreaView>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <FlatListBlock
                title="Gas"
                items={gasData}
                height={Platform.OS === "web" ? 343 : "50%"}
                scrollHeight={64}
                NavigateTo={NavigateTo}
            />
            <FlatListBlock
                title="Power"
                items={powerData}
                height={Platform.OS === "web" ? 380 : "50%"}
                scrollHeight={63}
                NavigateTo={NavigateTo}
            />
        </SafeAreaView>
    );
};

export default Portfolio;
