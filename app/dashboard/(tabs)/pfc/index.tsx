import React, { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";

const PFC = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pfcGas, setpfcGas] = useState<any>();
    const [pfcStrom, setpfcStrom] = useState<any>();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let NavigateTo = "dashboard/pfc";
    const combinedData = [
        { type: "header", title: "Gas", data: pfcGas },
        { type: "header", title: "Strom", data: pfcStrom },
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

    const onRefresh = async () => {
        setIsRefreshing(true);
        // Simulate a network request or refresh data logic
        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);
    };
    useEffect(() => {
        dispatch(inActiveLoading());
        setTimeout(() => {
            setpfcGas(PFCGas);
            setpfcStrom(PFCStrom);
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
                keyExtractor={(item, index) => `${item.title}-${index}`}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={["#e31837"]}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default PFC;
