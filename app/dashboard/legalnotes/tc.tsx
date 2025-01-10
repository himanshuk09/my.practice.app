import { i18n } from "@/languageKeys/i18nConfig";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const TermsAndConditionsScreen = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const locale = useSelector((state: any) => state.language.locale);
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className="top-0 w-full z-50 p-5 bg-[#e31837] h-24">
                <Text className="text-2xl uppercase font-normal text-white ">
                    {i18n.t("termsConditions")}
                </Text>
            </View>
            <ScrollView
                className="px-5"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="pl-2 pt-3">
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.terms")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium ">
                        {i18n.t("termsAndConditions.contractPartiesAndObject")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.contractPartiesAndObjectDescription1"
                        )}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.contractPartiesAndObjectDescription2"
                        )}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.term")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.termDescription")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.scope")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.scopeDescription")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.services")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.servicesDescription")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md space-y-2 font-normal">
                        {i18n.t("termsAndConditions.servicesPoints")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.usersCommitments")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.usersCommitmentsDescription"
                        )}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint1")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint2")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint3")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint4")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint5")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint6")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint7")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t("termsAndConditions.usercommitmentPoint8")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.intellectualProperty")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2 text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.intellectualPropertyDescription"
                        )}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.enexionRights")}
                    </Text>
                    {locale === "de" && (
                        <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                            {i18n.t(
                                "termsAndConditions.enexionRightsDescription"
                            )}
                        </Text>
                    )}
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.enexionRight1")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.enexionRight2")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.enexionRight3")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.termination")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.terminationDescription1")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.terminationDescription2")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.supplementaryAgreements")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.supplementaryAgreementsDescription1"
                        )}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.supplementaryAgreementsDescription2"
                        )}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.supplementaryAgreementsDescription3"
                        )}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.supplementaryAgreementsDescription4"
                        )}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.applicableLaw")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t("termsAndConditions.applicableLawDescription")}
                    </Text>
                    <Text className="text-black py-2 text-lg font-medium">
                        {i18n.t("termsAndConditions.severabilityClause")}
                    </Text>
                    <Text className="text-[#4b4b4e] py-2  text-md font-normal">
                        {i18n.t(
                            "termsAndConditions.severabilityClauseDescription"
                        )}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndConditionsScreen;
