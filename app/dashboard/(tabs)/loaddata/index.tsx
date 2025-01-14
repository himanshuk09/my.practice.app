import React, { useEffect, useRef } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { AccordionData, AccordionData2 } from "@/constants/constantData";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadData = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const data = [
        { id: "1", data: AccordionData, title: "Gas" },
        { id: "2", data: AccordionData, title: "Power" },
    ];
    const startLoader = () => {
        dispatch(activeLoading());
    };
    const renderItem = ({ item, index }: any) => (
        <AccordionFlatlist
            data={AccordionData}
            title={item?.title}
            startLoader={startLoader}
            scrollToIndex={scrollToIndex}
            index={index}
        />
    );
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    const mainFlatListRef = useRef<FlatList>(null);

    const scrollToIndex = (index: any) => {
        mainFlatListRef.current?.scrollToIndex({
            index,
            animated: true,
        });
    };
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
                ref={mainFlatListRef}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default LoadData;
