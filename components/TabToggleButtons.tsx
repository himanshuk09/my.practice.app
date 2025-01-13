import { i18n } from "@/languageKeys/i18nConfig";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface TabToggleButtonsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabToggleButtons: React.FC<any> = React.memo(
    ({ activeTab, setActiveTab, visibleTabs }) => {
        const allTabs = ["Day", "Week", "Month", "Quarter", "Year"];
        const tabs = visibleTabs || allTabs;
        return (
            <View className="flex-row justify-between border-t bg-gray-100 border-slate-200 w-full">
                {tabs.map((tab: any) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-center rounded-sm h-14 ${
                            activeTab === tab
                                ? "border-b-4 border-primary bg-white shadow-sm shadow-slate-200"
                                : "bg-gray-100 shadow-lg border-b-0"
                        }`}
                    >
                        <Text
                            className={`text-lg text-center font-semibold ${
                                activeTab === tab
                                    ? "text-primary"
                                    : "text-[#898a8c]"
                            }`}
                        >
                            {i18n.t(tab)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
        return (
            <View className="flex-row justify-evenly border-t bg-gray-100 border-slate-200 w-full ">
                {tabs.map((tab: any) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`py-3 px-4 text-center rounded-sm h-14     ${
                            activeTab === tab
                                ? " border-b-4 border-primary  bg-white drop-shadow-sm shadow-sm shadow-slate-200"
                                : "bg-gray-100  shadow-lg  border-b-0 "
                        } `}
                    >
                        <Text
                            className={`text-lg text-center font-semibold  ${
                                activeTab === tab
                                    ? "text-primary"
                                    : "text-[#898a8c]"
                            }`}
                        >
                            {i18n.t(tab)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
);

export default TabToggleButtons;
