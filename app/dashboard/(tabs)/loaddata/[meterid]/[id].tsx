import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AccordionData } from "@/constants/constantData";
import { useSelector } from "react-redux";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { i18n } from "@/languageKeys/i18nConfig";
import { cockpitChartData } from "@/constants/cockpitchart";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { RootState } from "@/store/store";
import { saveCSVToFile } from "@/components/ConstantFunctions/saveCSVFile";

const LoadDataDetails = () => {
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    const [loadDetail, setloadDetails] = useState<any>();
    const { meterId, id } = useLocalSearchParams();
    console.log(meterId, id);

    useEffect(() => {
        const filteredItem = AccordionData.find((item: any) =>
            item.details.some((detail: any) => detail.id === Number(id))
        );

        if (filteredItem) {
            const selectedDetail = filteredItem.details.find(
                (detail: any) => detail.id === Number(id)
            );
            setloadDetails(selectedDetail);
        } else {
            setloadDetails(null);
            console.warn("No matching detail found");
        }
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
            <View className="flex-1  bg-white">
                {!isLandscape && (
                    <View className="flex justify-between bg-white  flex-row px-3 pl-5 py-1 m-1 h-28 shadow-2xl shadow-black ">
                        <View
                            className="flex-col py-1"
                            style={{
                                width: Platform.OS === "web" ? "90%" : "85%",
                            }}
                        >
                            <Text className="text-sm font-semibold text-mainCardHeaderText break-words">
                                {loadDetail?.channel}
                            </Text>
                            <View className="flex-row justify-items-start">
                                <Text className="text-mainCardHeaderText text-md">
                                    {i18n.t("Energy")}:{" "}
                                </Text>
                                <Text className="text-mainCardHeaderText text-sm ml-5">
                                    30,319 kWh
                                </Text>
                            </View>
                            <View className="flex-row justify-items-start  ">
                                <Text className="text-mainCardHeaderText text-md">
                                    {i18n.t("Average")}:{" "}
                                </Text>
                                <Text className="text-mainCardHeaderText text-sm ml-5">
                                    30,319 kWh
                                </Text>
                            </View>
                        </View>
                        <View className="px-2 justify-start pt-5">
                            <FontAwesome5
                                classname="mr-2"
                                name="file-download"
                                size={30}
                                color="#e31837"
                                onPress={() => saveCSVToFile(cockpitChartData)}
                            />
                        </View>
                    </View>
                )}
                {/**chart component */}
                <ToggleChartComponent
                    showRangePicker={false}
                    showPeriodOfTime={true}
                    showValueRange={true}
                />
            </View>
        </SafeAreaView>
    );
};

export default LoadDataDetails;
