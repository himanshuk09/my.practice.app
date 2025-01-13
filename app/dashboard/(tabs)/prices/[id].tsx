import { View, Text, SafeAreaView, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";
import { RootState } from "@/store/store";
import { fetchDataByToggle } from "@/services/auth.services";

const PricesDetails = () => {
    const { id } = useLocalSearchParams();
    const [pricesDetail, setPricesDetails] = useState<any>();
    const router = useRouter();

    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    useEffect(() => {
        console.log(typeof id);
        const filteredItem = PricesItem.filter(
            (item: any) => item.id === Number(id)
        );
        setPricesDetails(filteredItem[0]);
        console.log(filteredItem[0]);
    }, [id]);

    const [activeTab, setActiveTab] = useState("Year");
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
    const fetchChartData = async (tab: string) => {
        try {
            return fetchDataByToggle(tab);
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };
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
                    <View className="flex justify-between bg-white flex-row  m-1  h-24 px-3 shadow-2xl shadow-black pt-3 pl-5">
                        <View className="flex-col">
                            <Text className="text-xl break-words font-bold text-mainCardHeaderText">
                                {pricesDetail?.title}
                            </Text>
                            <View className="flex-row justify-between w-[90%]">
                                <Text className=" text-md text-mainCardHeaderText ">
                                    {getCurrentUTCDateTime()}
                                </Text>
                                <Text className="text-mainCardHeaderText  text-sm font-normal">
                                    {pricesDetail?.unit} €/MWh
                                </Text>
                            </View>
                        </View>

                        <View className="px-2 justify-start ">
                            <FontAwesome5
                                classname="mr-2"
                                name="file-download"
                                size={30}
                                color="#e31837"
                                onPress={() => {}}
                            />
                        </View>
                    </View>
                )}
                <ToggleChartComponent
                    showRangePicker={true}
                    showPeriodOfTime={true}
                    showValueRange={false}
                    fetchChartData={fetchChartData}
                />
            </View>
        </SafeAreaView>
    );
};

export default PricesDetails;
