import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	RefreshControl,
} from "react-native";
import Title from "@/components/ui/Title";
import { useDispatch } from "react-redux";
import { i18n } from "@/localization/config";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";

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
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView className="flex-1 bg-white">
			<Title title={"imprint"} />
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
				<View className="space-y-10 pl-4 pt-3 pb-8">
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
