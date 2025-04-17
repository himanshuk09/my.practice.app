import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StatusBar, Text, View } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLoadDataList } from "@/services/loaddata.service";
import { MeterArray } from "@/types/type";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { i18n } from "@/localization/config";

interface DataItem {
	id: string;
	data: MeterArray;
	title: string;
}

const LoadData = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const isOnline = useNetworkStatus();
	const mainFlatListRef = useRef<FlatList<DataItem>>(null);
	const [error, setError] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [loadDataGasList, setLoadDataGasList] = useState<MeterArray>([]);
	const [loadDataSromList, setLoadDataSromList] = useState<MeterArray>([]);

	const data: DataItem[] = [
		{ id: "1", data: loadDataGasList, title: "Gas" },
		{ id: "2", data: loadDataSromList, title: "Power" },
	];

	const scrollToIndex = (index: number) => {
		mainFlatListRef.current?.scrollToIndex({
			index,
			animated: true,
		});
	};
	const renderItem = ({ item, index }: { item: DataItem; index: number }) => (
		<AccordionFlatlist
			data={item?.data}
			title={item?.title}
			startLoader={() => dispatch(activeLoading())}
			scrollToIndex={scrollToIndex}
			index={index}
		/>
	);

	useEffect(() => {
		const fetchLoadDataList = async () => {
			if (!isOnline) {
				return;
			} else {
				try {
					const resLoadDataList = await getLoadDataList();
					if (
						resLoadDataList?.gas.length === 0 ||
						resLoadDataList?.strom.length === 0
					) {
						setError(true);
					} else {
						setLoadDataGasList(resLoadDataList?.gas || []);
						setLoadDataSromList(resLoadDataList?.strom || []);
						setError(false);
					}
				} catch (error: any) {
					console.log("Error fetching data:", error.message);
				} finally {
				}
			}
		};

		fetchLoadDataList();
	}, [isOnline]);

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
					ref={mainFlatListRef}
					data={data}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
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

export default LoadData;
