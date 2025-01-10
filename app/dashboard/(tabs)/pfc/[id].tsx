import { View, Text, SafeAreaView, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";
import { RootState } from "@/store/store";

const PFCDetails = () => {
    const { id } = useLocalSearchParams();
    const [pfcDetails, setPfcDetails] = useState<any>();
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    useEffect(() => {
        console.log(typeof id);
        const filteredItem =
            PFCGas.find((item: any) => item.id === Number(id)) ||
            PFCStrom.find((item: any) => item.id === Number(id));
        setPfcDetails(filteredItem);
        console.log(filteredItem);
    }, [id]);

    const getCurrentUTCDateTime = () => {
        const now = new Date();
        // Extract UTC components
        const day = String(now.getUTCDate()).padStart(2, "0");
        const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = now.getUTCFullYear();
        const hours = String(now.getUTCHours()).padStart(2, "0");
        const minutes = String(now.getUTCMinutes()).padStart(2, "0");

        // Format as DD/MM/YYYY HH:mm
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <SafeAreaView className="flex-1 ">
            <StatusBar
                barStyle="dark-content"
                backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className="flex-1  bg-white">
                {/* Header Section */}
                {!isLandscape && (
                    <View className="flex justify-between bg-white flex-row  m-1  h-24 px-3 pl-5 shadow-2xl shadow-black pt-3">
                        <View className="flex-col w-60  ">
                            <Text className="text-xl break-words font-bold text-mainCardHeaderText">
                                {pfcDetails?.title}
                            </Text>
                            <Text className=" text-md text-mainCardHeaderText ">
                                {getCurrentUTCDateTime()}
                            </Text>
                        </View>
                        <View className="px-2 justify-start">
                            <FontAwesome5
                                classname="mr-2"
                                name="file-download"
                                size={30}
                                color="#e11935"
                                onPress={() => {}}
                            />
                        </View>
                    </View>
                )}
                <ToggleChartComponent
                    showRangePicker={false}
                    showPeriodOfTime={true}
                    showValueRange={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default PFCDetails;
