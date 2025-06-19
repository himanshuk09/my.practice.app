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
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { germanyLocale, i18n } from "@/localization/config";

const PrivacyAndPolicy = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const locale = useSelector((state: RootState) => state.culture.locale);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		setTimeout(() => dispatch(inActiveLoading()), 100);
	}, [isFocused]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<Title title={"privacypolicy"} />
			<ScrollView
				className="flex-1 px-5 mb-5"
				contentContainerStyle={{ flexGrow: 1 }}
				nestedScrollEnabled={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
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
						{i18n.t("privacyAndPolicy.privacypolicy")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.effectivedate")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.para1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.para2")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.para3")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.para4")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h1p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h1p2")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h1s1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h1s1p1")}
					</Text>
					{locale === germanyLocale && (
						<React.Fragment>
							<Text className="text-[#4b4b4e] py-2 text-md font-normal">
								{i18n.t("privacyAndPolicy.h1s1p2")}
							</Text>
							<Text className="text-[#4b4b4e] py-2 text-md font-normal">
								{i18n.t("privacyAndPolicy.h1s1p3")}
							</Text>
						</React.Fragment>
					)}
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h1p3")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h2")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h2p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h2p2")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h2s1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h2s1p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h1s1d")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h2p3")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h2p4")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h3")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h3p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h3p1p")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h3p2")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h3p2p")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h4")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h4p1")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h5")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h5d")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h6")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h6p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h6p2")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h7")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h7p1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h7p2")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h7p3")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h7s1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h7s1d1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h7s1d2")}
					</Text>
					<Text className="text-black py-2 text-lg font-medium">
						{i18n.t("privacyAndPolicy.h8")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h8d1")}
					</Text>
					<Text className="text-[#4b4b4e] py-2 text-md font-normal">
						{i18n.t("privacyAndPolicy.h8d2")}
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default PrivacyAndPolicy;
