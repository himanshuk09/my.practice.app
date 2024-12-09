import React, { JSXElementConstructor, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";

interface PropsType {
  defaultState?: boolean;
  activeText: string;
  inActiveText: string;
  ActiveIcon: React.FC;
  InActiveIcon: React.FC;
  toggleSwitch: () => void;
}

const LanguageToggleSwitch = ({
  defaultState = false,
  activeText,
  inActiveText,
  ActiveIcon,
  InActiveIcon,
  toggleSwitch,
}: PropsType) => {
  return (
    <View
      className="flex-row mx-5  bg-[#985f5f] rounded-full p-1 items-center justify-between relative"
      style={{ minHeight: 22 }}
    >
      {defaultState && (
        <View className="mx-1 left-0 relative">
          <Text className="text-sm font-bold text-white">{activeText}</Text>
        </View>
      )}
      {!defaultState && (
        <View className="mx-1 -right-6 relative">
          <Text className="text-sm font-bold text-white">{inActiveText}</Text>
        </View>
      )}

      {defaultState && (
        <View
          className={`absolute w-[20px] h-full rounded-full shadow-lg items-center justify-center right-0 `}
        >
          <ActiveIcon />
        </View>
      )}

      {!defaultState && (
        <View
          className={`absolute w-[20px] h-full rounded-full shadow-lg items-center justify-center left-0 `}
        >
          <InActiveIcon />
        </View>
      )}

      <TouchableOpacity
        className="absolute top-0 bottom-0 left-0 right-0 flex-1 items-center justify-center"
        onPress={toggleSwitch}
      />
    </View>
  );
};
export default LanguageToggleSwitch;
