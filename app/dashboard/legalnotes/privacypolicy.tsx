import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { i18n } from "@/languageKeys/i18nConfig";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const Privacy = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  // Function to convert JSON to CSV
  const jsonToCSVv = (jsonData: any[]) => {
    // Extract headers from the first object of the JSON array
    const headers = Object.keys(jsonData[0]);

    // Map through each item in the JSON array to create CSV rows
    const rows = jsonData.map((item) =>
      headers.map((header) => item[header]).join(",")
    );

    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");

    return csvContent;
  };
  const jsonToCSV = (jsonData: any[]) => {
    // Define headers as 'timestamp' and 'value'
    const headers = ["timestamp", "value"];

    // Map through each item in the JSON array to create CSV rows
    const rows = jsonData.map((item) =>
      // Map `x` to `timestamp` and `y` to `value`
      [item.x, item.y].join(",")
    );

    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");

    return csvContent;
  };
  // Function to save CSV to a file
  const saveCSVToFile = async (csvContent: string) => {
    const fileName = `${FileSystem.documentDirectory}data.csv`;

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

  // Example Usage
  const jsonData = [
    { x: "John", y: 28 },
    { x: "Jane", y: 22 },
    { x: "Doe", y: 32 },
  ];

  const csvContent = jsonToCSV(jsonData);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* <ComingSoon /> */}

      <Text className="text-4xl font-bold text-gray-700 mb-4">
        {i18n.t("comingsoon")}
      </Text>
      <Text className="text-lg text-center  text-gray-500">
        {i18n.t("We_re_working_hard_to_bring_you_something_amazing")}
      </Text>
      <TouchableOpacity onPress={() => saveCSVToFile(csvContent)}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Privacy;
