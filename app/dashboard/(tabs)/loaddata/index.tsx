import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLoadDataList } from "@/services/loaddata.service";
import { MeterArray } from "@/types/type";
interface DataItem {
	id: string;
	data: MeterArray;
	title: string;
}
const LoadData = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const mainFlatListRef = useRef<FlatList<DataItem>>(null);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [loadDataGasList, setLoadDataGasList] = useState<MeterArray>([]);
	const [loadDataSromList, setLoadDataSromList] = useState<MeterArray>([]);
	const onRefresh = async () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setIsRefreshing(false);
		}, 2000);
	};
	const data: DataItem[] = [
		{ id: "1", data: loadDataGasList, title: "Gas" },
		{ id: "2", data: loadDataSromList, title: "Power" },
	];
	const startLoader = () => {
		dispatch(activeLoading());
	};
	const scrollToIndex = (index: number) => {
		mainFlatListRef.current?.scrollToIndex({
			index,
			animated: true,
		});
	};
	const renderItem = ({
		item,
		index,
	}: {
		item: DataItem;
		index: number;
	}) => (
		<AccordionFlatlist
			data={item?.data}
			title={item?.title}
			startLoader={startLoader}
			scrollToIndex={scrollToIndex}
			index={index}
		/>
	);

	useEffect(() => {
		const fetchLoadDataList = async () => {
			const resLoadDataList = await getLoadDataList();
			setLoadDataGasList(resLoadDataList?.gas || []);
			setLoadDataSromList(resLoadDataList?.strom || []);
		};
		fetchLoadDataList();
	}, []);
	useLayoutEffect(() => {
		dispatch(inActiveLoading());
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
			<FlatList
				ref={mainFlatListRef}
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						colors={["#e31837"]} // Optional: Set colors for the refresh indicator
					/>
				}
			/>
		</SafeAreaView>
	);
};

export default LoadData;
