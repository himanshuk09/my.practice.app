import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	ScrollView,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { i18n } from "@/localization/config";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
const imprintDetails = [
	"company",
	"address1",
	"address2",
	"phone",
	"fax",
	"mail",
	"web",
	"court",
	"hrb",
	"taxId",
	"directors",
	"responsibleContent",
	"liability",
];
const Imprint = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
			<View className="top-0 w-full z-50 p-5 bg-primary h-24">
				<Text className="text-2xl font-normal text-white capitalize">
					{i18n.t("imprint")}
				</Text>
			</View>
			<ScrollView
				className="flex-1 px-5 mb-5"
				contentContainerStyle={{ flexGrow: 1 }}
				nestedScrollEnabled={true}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => setIsRefreshing(false)}
						colors={["#e31837"]}
					/>
				}
			>
				<View className="space-y-10 pl-4 pt-3">
					{imprintDetails.map((detail, index) => (
						<Text
							key={index}
							className="text-listText py-2 text-md font-normal"
						>
							{i18n.t(`imprints.${detail}`)}
						</Text>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Imprint;
