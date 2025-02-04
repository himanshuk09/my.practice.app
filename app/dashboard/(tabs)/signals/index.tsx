import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "react-native";

const Signals = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [signalsGas, setSignalsGas] = useState<any>();
    const [signalsStrom, setSignalsStrom] = useState<any>();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let NavigateTo = "dashboard/signals";
    const onRefresh = async () => {
        setIsRefreshing(true);
        // Simulate a network request or refresh data logic
        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);
    };
    const combinedData = [
        { type: "header", title: "Gas", data: signalsGas },
        { type: "header", title: "Strom", data: signalsStrom },
    ];
    const renderItem = ({ item }: any) => {
        if (item.type === "header") {
            return (
                <FlatListBlock
                    title={item.title}
                    items={item.data === undefined ? [] : item.data}
                    enableAutoScroll={false}
                    height={"auto"}
                    NavigateTo={NavigateTo}
                />
            );
        }
        return null;
    };

    useEffect(() => {
        dispatch(inActiveLoading());
        setTimeout(() => {
            setSignalsGas(SignalsGas);
            setSignalsStrom(SignalsStrom);
        }, 1000);
    }, [isFocused]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <FlatList
                data={combinedData}
                renderItem={renderItem}
                className=" overflow-scroll"
                keyExtractor={(item, index) => `${item.title}-${index}`}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={["#e31837"]} // Optional: Set colors for the refresh indicator
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Signals;
