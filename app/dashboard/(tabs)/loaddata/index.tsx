import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import { useDispatch } from "react-redux";
import NoData from "@/components/icons/NoData";
import { EnergyTypeEnum } from "@/types/chart.type";
import NoNetwork from "@/components/icons/NoNetwork";
import { useIsFocused } from "@react-navigation/native";
import { isIdRoute } from "@/app/dashboard/(tabs)/_layout";
import { getLoadDataList } from "@/services/loaddata.service";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, RefreshControl, SafeAreaView } from "react-native";

interface DataItem {
	id: string;
	title: string;
	data: any[];
}

const LoadData = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const mainFlatListRef = useRef<FlatList<DataItem>>(null);
	const [expandedMeterId, setExpandedMeterId] = useState<string | null>(null); // 🔑 Shared state
	const insets = useSafeAreaInsets();

	const { data, loading, error, refetch, isOnline } =
		useNetworkAwareApiRequest(getLoadDataList, {
			autoFetch: true,
			enabled: isFocused,
			deps: [isFocused],
			showGlobalLoader: false,
		});

	const scrollToIndex = (index: number) => {
		mainFlatListRef.current?.scrollToIndex({ index, animated: true });
	};

	const listData: DataItem[] = [
		{ id: "1", title: EnergyTypeEnum.GAS, data: data?.gas || [] },
		{ id: "2", title: EnergyTypeEnum.POWER, data: data?.strom || [] },
	];

	useLayoutEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (data?.gas?.length === 0) return <NoData />;

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
				marginTop: isIdRoute ? insets.top : 0,
			}}
		>
			<FlatList
				ref={mainFlatListRef}
				data={listData}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<AccordionFlatlist
						data={item.data}
						title={item.title}
						scrollToIndex={scrollToIndex}
						index={index}
						startLoader={() => dispatch(activeLoading())}
						expandedMeterId={expandedMeterId} // 🔑 pass shared state
						setExpandedMeterId={setExpandedMeterId}
					/>
				)}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={refetch}
						colors={["#e31837"]}
					/>
				}
				contentContainerStyle={{
					paddingBottom: 40,
				}}
			/>
		</SafeAreaView>
	);
};

export default LoadData;
