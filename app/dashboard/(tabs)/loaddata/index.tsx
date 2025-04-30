import React, { useLayoutEffect, useRef } from "react";
import { FlatList, RefreshControl, SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";
import NoData from "@/components/icons/NoData";
import NoNetwork from "@/components/icons/NoNetwork";
import { useIsFocused } from "@react-navigation/native";
import { getLoadDataList } from "@/services/loaddata.service";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";

interface DataItem {
	id: string;
	title: string;
	data: any[];
}

const LoadData = () => {
	const mainFlatListRef = useRef<FlatList<DataItem>>(null);
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

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
		{ id: "1", title: "Gas", data: data?.gas || [] },
		{ id: "2", title: "Power", data: data?.strom || [] },
	];

	useLayoutEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (data?.gas?.length === 0) return <NoData />;
	return (
		<SafeAreaView className="flex-1 bg-white">
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
			/>
		</SafeAreaView>
	);
};

export default LoadData;
