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
import { PFCGas, PFCStrom } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";

const PFCDetails = () => {
  const { id } = useLocalSearchParams();
  const [pfcDetails, setPfcDetails] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    console.log(typeof id);
    // const filteredItem =
    //   PFCGas.filter((item: any) => item.id === Number(id))
    const filteredItem =
      PFCGas.find((item: any) => item.id === Number(id)) ||
      PFCStrom.find((item: any) => item.id === Number(id));
    setPfcDetails(filteredItem);
    console.log(filteredItem);
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
    <SafeAreaView className="flex-1 ">
      <StatusBar />

      <View className="flex-1  bg-white">
        {/* Header Section */}
        <View className="flex justify-between bg-white flex-row  m-1  h-24 px-4 shadow-2xl shadow-black pt-3">
          <View className="flex-col w-60  ">
            <Text className="text-xl break-words font-bold text-[#b5b5b5]">
              {pfcDetails?.title}
            </Text>
            <Text className=" text-md text-[#b5b5b5] ">
              {getCurrentUTCDateTime()}
            </Text>
          </View>
          <View className="">
            <FontAwesome5
              classname="mr-2 mt-2"
              name="file-download"
              size={35}
              color="#e11935"
              onPress={() => {}}
            />
          </View>
        </View>
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
