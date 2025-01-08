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

const LoadDataDetails = () => {
  const isLandscape = useSelector(
    (state: RootState) => state.orientation.isLandscape
  );
  const [loadDetail, setloadDetails] = useState<any>();
  const { meterId, id } = useLocalSearchParams();
  console.log(meterId, id);

  //convert json to CSV
  const splitTimestamp = (timestamp: number) => {
    const date = new Date(timestamp); // Convert timestamp to Date object
    const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
    const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
    [0]; // Extract UTC time (HH:mm:ss)
    return { formattedDate, formattedTime };
  };
  // Function to save CSV to a file
  const saveCSVToFile = async (jsonData: any[]) => {
    const headers = ["Date", "Time", "[kwh]"];
    const rows = jsonData.map((item) => {
      const { formattedDate, formattedTime } = splitTimestamp(item.x); // Split timestamp
      return [formattedDate, formattedTime, item.y].join(","); // Combine into CSV row
    });
    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");
    const fileName = `${FileSystem.documentDirectory}cockpit.csv`;
    try {
      // Write CSV content to file
      await FileSystem.writeAsStringAsync(fileName, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log(`CSV file saved at: ${fileName}`);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileName);
      }
    } catch (error) {
      console.error("Error saving CSV file:", error);
    }
  };

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
        backgroundColor="#ffffff"
        animated
        showHideTransition={"slide"}
        networkActivityIndicatorVisible
      />
      <View className="flex-1  bg-white">
        {!isLandscape && (
          <View className="flex justify-between bg-white  flex-row px-4  m-1 h-28 shadow-2xl shadow-black ">
            <View
              className="flex-col py-1"
              style={{
                width: Platform.OS === "web" ? "90%" : "85%",
              }}
            >
              <Text className="text-sm font-semibold text-[#b5b5b5] break-words">
                {loadDetail?.channel}
              </Text>
              <View className="flex-row justify-items-start">
                <Text className="text-[#b5b5b5] text-md">
                  {i18n.t("Energy")}:{" "}
                </Text>
                <Text className="text-[#b5b5b5] text-sm ml-5">30,319 kWh</Text>
              </View>
              <View className="flex-row justify-items-start  ">
                <Text className="text-[#b5b5b5] text-md">
                  {i18n.t("Average")}:{" "}
                </Text>
                <Text className="text-[#b5b5b5] text-sm ml-5">30,319 kWh</Text>
              </View>
            </View>
            <View className="py-5 ">
              <FontAwesome5
                name="file-download"
                size={35}
                color="#ef4444"
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
