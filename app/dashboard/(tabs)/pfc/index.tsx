import { useDispatch } from "react-redux";
import NoData from "@/components/icons/NoData";
import React, { useLayoutEffect } from "react";
import NoNetwork from "@/components/icons/NoNetwork";
import { getPFCList } from "@/services/pfc.service";
import { PriceForwardCurveArray } from "@/types/type";
import FlatListBlock from "@/components/FlatListBlock";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest"; // 👈 your shared hook
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	ListRenderItem,
} from "react-native";

interface CombinedData {
	type: "header";
	title: string;
	data: PriceForwardCurveArray;
}

const PFC = () => {
	const isFocused = useIsFocused();
	const NavigateTo = "dashboard/pfc";
	const dispatch = useDispatch();
	const {
		data: pfcResponse,
		error,
		loading,
		isOnline,
		refetch,
	} = useNetworkAwareApiRequest(getPFCList, {
		autoFetch: true,
		enabled: isFocused,
		showGlobalLoader: false,
		deps: [isFocused],
	});

	const combinedData: CombinedData[] = [
		{ type: "header", title: "Gas", data: pfcResponse?.gas || [] },
		{ type: "header", title: "Strom", data: pfcResponse?.strom || [] },
	];

	const renderItem: ListRenderItem<CombinedData> = ({ item }) => {
		if (item.type === "header") {
			return (
				<FlatListBlock
					title={item.title}
					items={item.data || []}
					enableAutoScroll={false}
					height={"auto"}
					NavigateTo={NavigateTo}
					renderType="pfc"
				/>
			);
		}
		return null;
	};
	useLayoutEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (pfcResponse?.gas?.length === 0) return <NoData />;
	return (
		<SafeAreaView className="flex-1 bg-white">
			<FlatList
				data={combinedData}
				renderItem={renderItem}
				keyExtractor={(item, index) => `${item.title}-${index}`}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={refetch}
						colors={["#e31837"]}
					/>
				}
			/>
		</SafeAreaView>
	);
};

export default PFC;
