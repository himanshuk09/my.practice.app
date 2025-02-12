import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { AccordionData } from "@/constants/constantData";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadData = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [loadDataMeters, setLoadDataMeters] = useState<any>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onRefresh = async () => {
		setIsRefreshing(true);
		// Simulate a network request or refresh data logic
		setTimeout(() => {
			setIsRefreshing(false);
		}, 2000);
	};
	const data = [
		{ id: "1", data: loadDataMeters, title: "Gas" },
		{ id: "2", data: loadDataMeters, title: "Power" },
	];
	const startLoader = () => {
		dispatch(activeLoading());
	};
	const renderItem = ({ item, index }: any) => (
		<AccordionFlatlist
			data={item?.data}
			title={item?.title}
			startLoader={startLoader}
			scrollToIndex={scrollToIndex}
			index={index}
		/>
	);

	const mainFlatListRef = useRef<FlatList>(null);

	const scrollToIndex = (index: number) => {
		mainFlatListRef.current?.scrollToIndex({
			index,
			animated: true,
		});
	};
	useLayoutEffect(() => {
		dispatch(inActiveLoading());
		setTimeout(() => {
			setLoadDataMeters(AccordionData);
		}, 1000);
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
