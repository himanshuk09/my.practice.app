import React, { useEffect } from "react";
import { FlatList, SafeAreaView, StatusBar, View } from "react-native";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";

const PFC = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const combinedData = [
        { type: "header", title: "Gas", data: PFCGas },
        { type: "header", title: "Strom", data: PFCStrom },
    ];
    const renderItem = ({ item }: any) => {
        if (item.type === "header") {
            return (
                <FlatListBlock
                    title={item.title}
                    items={item.data}
                    enableAutoScroll={false}
                    height={"auto"}
                />
            );
        }
        return null;
    };
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
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
            />
        </SafeAreaView>
    );
};

export default PFC;
