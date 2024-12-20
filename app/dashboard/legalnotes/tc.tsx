import React, { useEffect } from "react";
import { View, Text, Image, Button } from "react-native";

import { i18n } from "@/languageKeys/i18nConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { getProfileData } from "@/services/auth.services";
const TC = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* <ComingSoon /> */}
      <Button title="get profile " onPress={getProfileData} />
      <Text className="text-4xl font-bold text-gray-700 mb-4">
        {i18n.t("comingsoon")}
      </Text>
      <Text className="text-lg text-center  text-gray-500">
        {i18n.t("We_re_working_hard_to_bring_you_something_amazing")}
      </Text>
    </View>
  );
};

export default TC;
