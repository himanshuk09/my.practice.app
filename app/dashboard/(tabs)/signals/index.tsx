import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	FlatList,
	RefreshControl,
	View,
	Text,
} from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { i18n } from "@/localization/config";

const Signals = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	let NavigateTo = "dashboard/signals";
	const [error, setError] = useState(false);
	const [signalsGas, setSignalsGas] = useState<any>();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [signalsStrom, setSignalsStrom] = useState<any>();

	const combinedData = [
		{ type: "header", title: "Gas", data: signalsGas },
		{ type: "header", title: "Strom", data: signalsStrom },
	];
	const renderItem = ({ item }: any) => {
		if (item.type === "header") {
			return (
				<FlatListBlock
					title={item.title}
					items={item.data === undefined ? [] : item.data}
					enableAutoScroll={false}
					height={"auto"}
					NavigateTo={NavigateTo}
				/>
			);
		}
		return null;
	};

	useEffect(() => {
		dispatch(inActiveLoading());
		setTimeout(() => {
			setSignalsGas(SignalsGas);
			setSignalsStrom(SignalsStrom);
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
					className=" overflow-scroll"
					keyExtractor={(item, index) => `${item.title}-${index}`}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={() => setIsRefreshing(false)}
							colors={["#e31837"]} // Optional: Set colors for the refresh indicator
						/>
					}
				/>
			)}
		</SafeAreaView>
	);
};

export default Signals;
