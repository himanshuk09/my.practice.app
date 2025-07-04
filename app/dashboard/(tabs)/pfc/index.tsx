import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	ListRenderItem,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import NoData from "@/components/icons/NoData";
import { getPFCList } from "@/services/pfc.service";
import { PriceForwardCurveArray } from "@/types/type";
import NoNetwork from "@/components/icons/NoNetwork";
import FlatListBlock from "@/components/FlatListBlock";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { isIdRoute } from "@/app/dashboard/(tabs)/_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import { EnergyTypeEnum, ScreenNameEnum } from "@/types/chart.type";

interface CombinedData {
	title: string;
	data: PriceForwardCurveArray;
}

const PFC = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const insets = useSafeAreaInsets();

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
		{ title: EnergyTypeEnum.GAS, data: pfcResponse?.gas || [] },
		{ title: EnergyTypeEnum.POWER, data: pfcResponse?.strom || [] },
	];

	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (pfcResponse?.gas?.length === 0) return <NoData />;

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
						items={item.data || []}
						height={"auto"}
						renderType={ScreenNameEnum.PFC}
					/>
				)}
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
				contentContainerStyle={{
					paddingBottom: 40,
				}}
			/>
		</SafeAreaView>
	);
};

export default PFC;
