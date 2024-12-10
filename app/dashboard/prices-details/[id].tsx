import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { FontAwesome5 } from "@expo/vector-icons";

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

  const [activeTab, setActiveTab] = useState("Week");

  const tabs = ["Day", "Week", "Month", "Quarter", "Year"];

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
        <View className="flex justify-between  flex-row px-4 py-4 my-1  border-b border-gray-300 shadow-slate-400 shadow-sm ">
          <View className="flex-col ">
            <Text className="text-lg font-bold">2025 Cal Base</Text>
            <Text className="text-gray-500">09/12/2024 00:00</Text>
          </View>
          <View>
            <Text className="text-red-500 text-lg font-semibold">
              92.660 €/MWh
            </Text>
          </View>
        </View>

        {/* Toggle Buttons */}
        <View className="flex-row justify-evenly w-full my-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-lg ${
                activeTab === tab ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  activeTab === tab ? "text-white" : "text-gray-700"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
