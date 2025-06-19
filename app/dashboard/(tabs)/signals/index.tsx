import { useDispatch } from "react-redux";
import NoData from "@/components/icons/NoData";
import React, { useEffect, useState } from "react";
import NoNetwork from "@/components/icons/NoNetwork";
import FlatListBlock from "@/components/FlatListBlock";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { isIdRoute } from "@/app/dashboard/(tabs)/_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

const Signals = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	let NavigateTo = "dashboard/signals";
	const [error, setError] = useState(false);
	const [signalsGas, setSignalsGas] = useState<any>();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [signalsStrom, setSignalsStrom] = useState<any>();
	const insets = useSafeAreaInsets();
	const combinedData = [
		{ type: "header", title: "gas", data: signalsGas },
		{ type: "header", title: "power", data: signalsStrom },
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
					renderType={"signal"}
				/>
			);
		}
		return null;
	};

	useEffect(() => {
		if (isFocused) {
			dispatch(inActiveLoading());
		}
		setTimeout(() => {
			setSignalsGas(SignalsGas);
			setSignalsStrom(SignalsStrom);
		}, 500);
	}, [isFocused]);
	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (signalsGas?.length === 0) return <NoData />;

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
				marginTop: isIdRoute ? insets.top : 0,
			}}
		>
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
				contentContainerStyle={{
					paddingBottom: 40,
				}}
			/>
		</SafeAreaView>
	);
};

export default Signals;
