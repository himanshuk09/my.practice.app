import React, { useEffect } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { Accordion } from "@/components/AccordionFlatlist";
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
    const renderItem = ({ item }: any) => (
        // <AccordionFlatlist
        //     data={AccordionData}
        //     title={item?.title}
        //     startLoader={startLoader}
        // />
        <></>
    );
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <View style={styles.container}>
            <Accordion data={AccordionData2} startLoader={startLoader} />
        </View>
    );
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    headerContainer: {
        backgroundColor: "#d32f2f",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    itemContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        padding: 10,
        elevation: 2,
    },
    itemTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    detailText: {
        fontSize: 14,
        color: "#555",
        paddingLeft: 10,
        marginVertical: 5,
    },
});
