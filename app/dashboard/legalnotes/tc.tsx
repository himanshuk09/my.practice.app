import {
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";
import { RootState } from "@/store/store";
import Title from "@/components/ui/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { germanyLocale, i18n } from "@/localization/config";

const TermsAndConditionsScreen = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const locale = useSelector((state: RootState) => state.culture.locale);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
	}, [isFocused]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<Title title={"termsConditions"} />
			<ScrollView
				className="px-5 mb-5"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				nestedScrollEnabled={true}
				scrollEnabled={true}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => setIsRefreshing(false)}
						colors={["#e31837"]} // Optional: Set colors for the refresh indicator
					/>
				}
			>
				<View className="pl-2 pt-3 pb-8">
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
					{locale === germanyLocale && (
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
