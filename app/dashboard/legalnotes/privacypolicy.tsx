import { i18n } from "@/languageKeys/i18nConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useDispatch } from "react-redux";

const PrivacyAndPolicy = () => {
    const termsDetails = [
        { key: "terms", isHeader: true },
        { key: "contractPartiesAndObject", isHeader: false },
        { key: "term", isHeader: false },
        { key: "scope", isHeader: false },
        { key: "services", isHeader: false },
        { key: "usersCommitments", isHeader: false },
        { key: "intellectualProperty", isHeader: false },
        { key: "enexionRights", isHeader: false },
        { key: "termination", isHeader: false },
        { key: "supplementaryAgreements", isHeader: false },
        { key: "applicableLaw", isHeader: false },
        { key: "severabilityClause", isHeader: false },
    ];
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <SafeAreaView className="flex-1">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className="top-0 w-full z-50 p-5 bg-[#e31837] h-24">
                <Text className="text-2xl font-normal text-white capitalize">
                    {i18n.t("privacypolicy")}
                </Text>
            </View>
            <ScrollView
                className="flex-1 px-5 "
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="pl-4 pt-3">
                    <Text className="text-listText py-2 text-md font-bold"></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyAndPolicy;
