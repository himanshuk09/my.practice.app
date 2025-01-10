import React, { useEffect } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "react-native";

const Signals = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const combinedData = [
        { type: "header", title: "Gas", data: SignalsGas },
        { type: "header", title: "Strom", data: SignalsStrom },
    ];
    const renderItem = ({ item }: any) => {
        if (item.type === "header") {
            return (
                <FlatListBlock
                    title={item.title}
                    items={item.data}
                    enableAutoScroll={false}
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
                className=" overflow-scroll"
                keyExtractor={(item, index) => `${item.title}-${index}`}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default Signals;
