import React, { useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	ListRenderItem,
	View,
	Text,
} from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { getPFCList } from "@/services/pfc.service";
import { PriceForwardCurveArray } from "@/types/type";
import { AppDispatch } from "@/store/store";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { i18n } from "@/localization/config";
interface CombinedData {
	type: "header";
	title: string;
	data: PriceForwardCurveArray;
}
const PFC = () => {
	const isFocused = useIsFocused();
	let NavigateTo = "dashboard/pfc";
	const isOnline = useNetworkStatus();
	const dispatch = useDispatch<AppDispatch>();
	const [error, setError] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [pfcGasList, setPFCGasList] = useState<PriceForwardCurveArray>([]);
	const [pfcStromList, setPFCStromList] = useState<PriceForwardCurveArray>(
		[]
	);
	const combinedData: CombinedData[] = [
		{ type: "header", title: "Gas", data: pfcGasList },
		{ type: "header", title: "Strom", data: pfcStromList },
	];
	const renderItem: ListRenderItem<CombinedData> = ({ item }) => {
		if (item.type === "header") {
			return (
				<FlatListBlock
					title={item.title}
					items={item.data === undefined ? [] : item.data}
					enableAutoScroll={false}
					height={"auto"}
					NavigateTo={NavigateTo}
					renderType="pfc"
				/>
			);
		}
		return null;
	};

	useEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	useEffect(() => {
		const fetchPFCLIst = async () => {
			if (!isOnline) {
				return;
			} else {
				try {
					let responsePFCList = await getPFCList();
					if (
						responsePFCList?.gas.length === 0 ||
						responsePFCList?.strom.length === 0
					) {
						setError(true);
					} else {
						setPFCGasList(responsePFCList?.gas);
						setPFCStromList(responsePFCList?.strom);
						setError(false);
					}
				} catch (error) {
					console.log("Error fetching PFC list:", error);
				} finally {
				}
			}
		};
		fetchPFCLIst();
	}, [isOnline]);
	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{error ? (
				<View
					className="items-center justify-center "
					style={{
						height: "90%",
					}}
				>
					<Text className="text-md font-medium text-mainCardHeaderText">
						{i18n.t("Data_not_available")}
					</Text>
				</View>
			) : (
				<FlatList
					data={combinedData}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${item.title}-${index}`}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={() => setIsRefreshing(false)}
							colors={["#e31837"]}
						/>
					}
				/>
			)}
		</SafeAreaView>
	);
};

export default PFC;
