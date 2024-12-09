import React from "react";
import { View, Text, Image } from "react-native";
// import ComingSoon from "@/assets/images/comingsoon.svg";
import { i18n } from "@/languageKeys/i18nConfig";
const Rate = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* <ComingSoon /> */}

      <Text className="text-4xl font-bold text-gray-700 mb-4">
        {i18n.t("comingsoon")}
      </Text>
      <Text className="text-lg text-center  text-gray-500">
        {i18n.t("We_re_working_hard_to_bring_you_something_amazing")}
      </Text>
    </View>
  );
};

export default Rate;
