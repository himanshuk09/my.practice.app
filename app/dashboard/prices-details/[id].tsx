import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import TabToggleButtons from "@/components/TabToggleButtons";

const PricesDetails = () => {
  const { id } = useLocalSearchParams();
  const [pricesDetail, setPricesDetails] = useState<any>();
  const router = useRouter();
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
  return (
    <SafeAreaView
      className="flex-1 "
      style={{
        paddingTop:
          Platform.OS === "android" ? StatusBar?.currentHeight || 100 : 10,
        marginTop: Platform.OS === "android" ? 36 : 0,
      }}
    >
      <StatusBar />

      <View className="flex-1  bg-white">
        {/* Header Section */}
        <View className="flex justify-between  flex-row px-4 py-1   h-28 shadow-slate-300 shadow-md ">
          <View className="flex-col py-4 ">
            <Text className="text-xl font-bold">{pricesDetail?.title}</Text>
            <Text className="text-gray-500 text-lg">
              {getCurrentUTCDateTime()}
            </Text>
          </View>
          <View className="py-4 ">
            <Text className="text-red-500 text-lg font-semibold">
              {pricesDetail?.unit} €/MWh
            </Text>
          </View>
        </View>
        {/* Toggle Buttons */}

        <TabToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Chart Placeholder */}
        <View className="flex-1 mx-4 bg-gray-100 rounded-lg border border-gray-300">
          {/* This will be replaced with your chart component */}
          <Text className="text-center text-gray-500 mt-20">
            Chart Placeholder
          </Text>
        </View>
        {/* Bottom Button */}
        <TouchableOpacity className="bg-red-500 py-4 mx-5 rounded-lg my-4">
          <Text className="text-white text-center text-lg font-semibold">
            Customize View
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PricesDetails;
