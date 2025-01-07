import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";
import { RootState } from "@/store/store";

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
  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex-1  bg-white">
        {/* Header Section */}

        {!isLandscape && (
          <View className="flex justify-between bg-white flex-row  m-1  h-24 px-4 shadow-2xl shadow-black pt-3">
            <View className="flex-col w-48  ">
              <Text className="text-xl break-words font-bold text-[#b5b5b5]">
                {pricesDetail?.title}
              </Text>
              <Text className=" text-md text-[#b5b5b5] ">
                {getCurrentUTCDateTime()}
              </Text>
            </View>

            <View className="flex-row w-48 px-2 justify-between items-center">
              <Text className="text-[#e11935]  text-md font-semibold">
                {pricesDetail?.unit} €/MWh
              </Text>

              <FontAwesome5
                classname="mr-2"
                name="file-download"
                size={35}
                color="#e11935"
                onPress={() => {}}
              />
            </View>
          </View>
        )}
        <ToggleChartComponent
          showRangePicker={true}
          showPeriodOfTime={true}
          showValueRange={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default PricesDetails;
