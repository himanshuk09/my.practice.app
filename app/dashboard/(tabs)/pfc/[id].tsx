import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import { useSelector } from "react-redux";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";
import { RootState } from "@/store/store";
import { fetchDataByToggle } from "@/services/auth.services";
import {
    saveCSVToFileWeb,
    saveCSVToFile,
} from "@/components/ConstantFunctions/saveCSVFile";
import { cockpitChartData } from "@/constants/cockpitchart";
import { ChartShimmer } from "@/components/ChartShimmer";

const PFCDetails = () => {
    const { id } = useLocalSearchParams();
    const [pfcDetails, setPfcDetails] = useState<any>([]);
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    let visibleTabs = ["Week", "Month", "Quarter", "Year", "Year_3"];
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
    const fetchChartData = async (tab: string) => {
        try {
            return fetchDataByToggle(tab);
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };
    useEffect(() => {
        const filteredItem =
            PFCGas.find((item: any) => item.id === Number(id)) ||
            PFCStrom.find((item: any) => item.id === Number(id));
        setTimeout(() => {
            setPfcDetails(filteredItem);
        }, 1000);
    }, [id]);

    return (
        <SafeAreaView className="flex-1 ">
            <StatusBar
                barStyle="dark-content"
                backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            {pfcDetails <= 0 ? (
                <View className="flex-1  bg-white">
                    <ChartShimmer />
                </View>
            ) : (
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
                                    onPress={() => {
                                        if (Platform.OS === "web") {
                                            saveCSVToFileWeb(cockpitChartData);
                                        } else {
                                            saveCSVToFile(cockpitChartData);
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    <ToggleChartComponent
                        showRangePicker={false}
                        showPeriodOfTime={true}
                        showValueRange={false}
                        visibleTabs={visibleTabs}
                        fetchChartData={fetchChartData}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default PFCDetails;
