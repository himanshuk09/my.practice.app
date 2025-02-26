import React, { useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	ListRenderItem,
} from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { getPFCList } from "@/services/pfc.services";
import { PriceForwardCurveArray } from "@/types/type";
import { AppDispatch } from "@/store/store";
import useNetworkStatus from "@/hooks/useNetworkStatus";
interface CombinedData {
	type: "header";
	title: string;
	data: PriceForwardCurveArray;
}
const PFC = () => {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [pfcGasList, setPFCGasList] = useState<PriceForwardCurveArray>([]);
	const [pfcStromList, setPFCStromList] = useState<PriceForwardCurveArray>(
		[]
	);
	const dispatch = useDispatch<AppDispatch>();
	const isFocused = useIsFocused();
	const isOnline = useNetworkStatus();
	let NavigateTo = "dashboard/pfc";
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

	const onRefresh = async () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setIsRefreshing(false);
		}, 2000);
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
					setPFCGasList(responsePFCList?.gas);
					setPFCStromList(responsePFCList?.strom);
				} catch (error) {
					console.log("Error fetching PFC list:", error);
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
			<FlatList
				data={combinedData}
				renderItem={renderItem}
				keyExtractor={(item, index) => `${item.title}-${index}`}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						colors={["#e31837"]}
					/>
				}
			/>
		</SafeAreaView>
	);
};

export default PFC;
