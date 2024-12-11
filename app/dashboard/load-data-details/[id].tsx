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
import { AccordionData, PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import TabToggleButtons from "@/components/TabToggleButtons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { toggleFilter } from "@/store/chartDataFilterToggle";
const PricesDetails = () => {
  const { id } = useLocalSearchParams();
  const [loadDetail, setloadDetails] = useState<any>();
  const router = useRouter();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState<string>("Year");
  const tabs = ["Day", "Week", "Month", "Quarter", "Year"];
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  useEffect(() => {
    const filteredItem = AccordionData.find((item: any) =>
      item.details.some((detail: any) => detail.id === Number(id))
    );
    if (filteredItem) {
      const selectedDetail = filteredItem.details.find(
        (detail: any) => detail.id === Number(id)
      );
      setloadDetails(selectedDetail);
      console.log(filteredItem);
    } else {
      setloadDetails(null);
      console.log("No matching detail found");
    }
  }, [id]);
  // const activeTab = useSelector((state: any) => state.activeTabFilter.value);
  // const setActiveTab = (tab: any) => {
  //   dispatch(toggleFilter(tab));
  // };
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
        <View className="flex justify-between  flex-row px-4   h-28 shadow-slate-300 shadow-lg">
          <View
            className="flex-col py-4"
            style={{
              width: Platform.OS === "web" ? "90%" : "85%",
            }}
          >
            <Text className="text-sm font-semibold break-words">
              {loadDetail?.channel}
            </Text>
            <View className="flex-row justify-items-start">
              <Text className="text-gray-500 text-md">Energy: </Text>
              <Text className="text-gray-500 text-md ml-5">30,319 kWh</Text>
            </View>
            <View className="flex-row justify-items-start  ">
              <Text className="text-gray-500 text-md">Energy: </Text>
              <Text className="text-gray-500 text-md ml-5">30,319 kWh</Text>
            </View>
          </View>
          <View className="py-3 ">
            <FontAwesome5 name="file-download" size={35} color="#ef4444" />
          </View>
        </View>

        {/* Toggle Buttons */}
        <View className="flex-row justify-evenly border-[1px] border-slate-200 w-full my-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`py-2 px-4 text-center rounded-sm h-12 ${
                activeTab === tab
                  ? " border-b-4 border-red-500 "
                  : "bg-gray-200 shadow-lg"
              }      `}
            >
              <Text
                className={`text-lg text-center font-semibold ${
                  activeTab === tab ? "text-red-500" : "text-gray-700"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TabToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} /> */}
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
