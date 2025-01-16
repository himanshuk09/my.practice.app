import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateLocale } from "@/store/languageSlice";
import { i18n } from "@/languageKeys/i18nConfig";
import { useRouter } from "expo-router";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import CustomSwitch from "@/components/CustomSwitch";
import { st } from "@/utils/Styles";

const Settings = () => {
    const { locale } = useSelector((state: RootState) => state.language);
    const [selectedLanguage, setSelectedLanguage] = useState(locale);
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const isFocused = useIsFocused();
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [isSignalsEnabled, setIsSignalsEnabled] = useState(true);

    useEffect(() => {
        let timer = setTimeout(() => dispatch(inActiveLoading()), 0);
        return () => clearTimeout(timer);
    }, [isFocused]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className=" w-full z-50 p-3 mt-1 bg-primary">
                <Text className="flex justify-start font-normal  py-2 p-3  items-center  h-16 text-xl capitalize rounded-sm text-white">
                    {i18n.t("settings")}
                </Text>
            </View>
            <View className="p-2 mb-2 pl-5 bg-white" style={st.boxShadow}>
                <Text className="text-base font-semibold capitalize text-dropdownSecondTitle">
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
                        style={{
                            color: "#0f172a",
                            fontSize: 16,
                            fontWeight: "900",
                        }}
                    />
                    <Picker.Item
                        label="DEUTSCH"
                        value="de"
                        style={{
                            color: "#0f172a",
                            fontSize: 16,
                            fontWeight: 400,
                        }}
                    />
                </Picker>
            </View>
            <View className="p-2  pl-5  bg-white" style={st.boxShadow}>
                <Text className="text-base capitalize font-semibold text-dropdownSecondTitle">
                    {i18n.t("notifications")}
                </Text>
                <View className="flex flex-row items-center justify-between my-4">
                    <Text className="pl-5 text-base text-gray-800 font-normal capitalize">
                        {i18n.t("show_notifications")}
                    </Text>
                    <View className="w-20 mr-3">
                        <CustomSwitch
                            isEnabled={isNotificationEnabled}
                            setIsEnabled={setIsNotificationEnabled}
                        />
                    </View>
                </View>
                <View className="flex flex-row items-center justify-between mb-4">
                    <Text className="pl-5 text-base text-gray-800 font-normal capitalize">
                        {i18n.t("signals")}
                    </Text>
                    <View className="w-20 mr-3">
                        <CustomSwitch
                            isEnabled={isSignalsEnabled}
                            setIsEnabled={setIsSignalsEnabled}
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
                    <Text className="text-center text-[#e31837] font-normal uppercase bg-white">
                        {i18n.t("cancel")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center p-5  w-[50%] bg-[#e31837]"
                    onPress={() => {
                        dispatch(updateLocale(selectedLanguage));
                        router.back();
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
