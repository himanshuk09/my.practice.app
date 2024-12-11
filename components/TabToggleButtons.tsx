import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface TabToggleButtonsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabToggleButtons: React.FC<any> = React.memo(
  ({ activeTab, setActiveTab }) => {
    const tabs = ["Day", "Week", "Month", "Quarter", "Year"];

    return (
      <View className="flex-row justify-evenly border-[1px] border-slate-200 w-full my-2">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              console.log("clicked");
              setActiveTab(tab);
            }}
            className={`py-2 px-4 text-center rounded-sm h-12 ${
              activeTab === tab
                ? " border-b-4 border-red-500 "
                : "bg-gray-200 shadow-lg"
            }`}
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
    );
  }
);

export default TabToggleButtons;
