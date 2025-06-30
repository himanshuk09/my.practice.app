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
import { EnergyTypeEnum, ScreenNameEnum } from "@/types/chart.type";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";

const Signals = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [error, setError] = useState(false);
	// const [signalsGas, setSignalsGas] = useState<any>();
	const [isRefreshing, setIsRefreshing] = useState(false);
	// const [signalsStrom, setSignalsStrom] = useState<any>();
	const insets = useSafeAreaInsets();

	const getSignalsList = async () => {
		try {
			return await new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						SignalsStrom: SignalsStrom,
						SignalsGas: SignalsGas,
					});
				}, 2000);
			});
		} catch (error) {
			console.error("Error in getsignalsList:", error);
			return;
			{
				SignalsStrom: [];
				SignalsGas: [];
			}
		}
	};

	const {
		data: signalsResponse,
		error: signalsError,
		loading: signalsLoading,
		isOnline,
		refetch,
	} = useNetworkAwareApiRequest(getSignalsList, {
		autoFetch: true,
		enabled: isFocused,
		showGlobalLoader: false,
		deps: [isFocused],
	});
	const combinedData = [
		{ title: EnergyTypeEnum.GAS, data: signalsResponse?.SignalsGas || [] },
		{
			title: EnergyTypeEnum.POWER,
			data: signalsResponse?.SignalsStrom || [],
		},
	];

	useEffect(() => {
		if (isFocused) {
			dispatch(inActiveLoading());
		}
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (signalsResponse?.length === 0) return <NoData />;

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
				marginTop: isIdRoute ? insets.top : 0,
			}}
		>
			<FlatList
				data={combinedData}
				renderItem={({ item, index }) => (
					<FlatListBlock
						title={item.title}
						items={item.data === undefined ? [] : item.data}
						enableAutoScroll={false}
						height={"auto"}
						renderType={ScreenNameEnum.SIGNALS}
					/>
				)}
				className=" overflow-scroll"
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
				contentContainerStyle={{
					paddingBottom: 40,
				}}
			/>
		</SafeAreaView>
	);
};

export default Signals;
