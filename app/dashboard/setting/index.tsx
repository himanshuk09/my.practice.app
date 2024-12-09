import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Switch,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateLocale } from "@/store/languageSlice";
import { i18n } from "@/languageKeys/i18nConfig";
import { useRouter } from "expo-router";

const Settings = () => {
  const { locale } = useSelector((state: any) => state.language);
  const [selectedLanguage, setSelectedLanguage] = useState(locale);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  // useEffect(() => {
  //   dispatch(updateLocale(selectedLanguage));
  // }, [selectedLanguage]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <View className=" w-full z-50 p-3 mt-1 bg-[#e31837]">
        <Text className="flex justify-start font-semibold  py-2 p-3  items-center  h-16 text-xl capitalize rounded-sm text-white">
          {i18n.t("settings")}
        </Text>
      </View>
      <View className="p-2 mx-1 border-slate-200 border-b-8 ">
        <Text className="text-base font-semibold capitalize text-gray-500">
          {i18n.t("language")}
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(newValue) => setSelectedLanguage(newValue)}
          className="w-full p-3 border-b-2  rounded-md "
        >
          <Picker.Item
            label="ENGLISH"
            value="en"
            style={{ color: "#0f172a", fontSize: 16, fontWeight: 400 }}
          />
          <Picker.Item
            label="DEUTSCH"
            value="de"
            style={{ color: "#0f172a", fontSize: 16, fontWeight: 400 }}
          />
        </Picker>
      </View>
      <View className="p-2 mx-1 border-slate-200 border-b-8 ">
        <Text className="text-base capitalize font-semibold text-gray-500">
          {i18n.t("notifications")}
        </Text>
        <View className="flex flex-row items-center justify-between ">
          <Text className="pl-5 text-base text-slate-900 font-normal capitalize">
            {i18n.t("show_notifications")}
          </Text>
          <View className="w-20 mr-3">
            <Switch
              style={{
                transform: [{ scaleX: 1.4 }, { scaleY: 1.2 }],
              }}
              trackColor={{ false: "gray", true: "#e31837" }}
              thumbColor={isEnabled ? "#f9fafb" : "#f9fafb"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View className="flex flex-row items-center justify-between ">
          <Text className="pl-5 text-base text-slate-900 font-normal capitalize">
            {i18n.t("signals")}
          </Text>
          <View className="w-20 mr-3">
            <Switch
              style={{
                transform: [{ scaleX: 1.4 }, { scaleY: 1.2 }],
              }}
              trackColor={{ false: "gray", true: "#e31837" }}
              thumbColor={isEnabled ? "#f9fafb" : "#f9fafb"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
      <View className="bottom-0 w-full right-0 left-0 absolute flex flex-row justify-evenly border-y-2 border-[#e31837]">
        <TouchableOpacity
          className="items-center p-5 w-[50%]"
          onPress={() => {
            router.back();
            setSelectedLanguage(locale);
          }}
        >
          <Text className="text-center text-[#e31837] font-normal uppercase">
            {i18n.t("cancel")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center p-5  w-[50%] bg-[#e31837]"
          onPress={() => {
            dispatch(updateLocale(selectedLanguage));
            router.push("/dashboard");
          }}
        >
          <Text className="text-center text-white uppercase font-normal">
            {i18n.t("save")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
