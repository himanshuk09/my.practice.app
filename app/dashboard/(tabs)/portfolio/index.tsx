import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Portfolioprops } from "@/types/type";
import NoData from "@/components/icons/NoData";
import NoNetwork from "@/components/icons/NoNetwork";
import FlatListBlock from "@/components/FlatListBlock";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { isIdRoute } from "@/app/dashboard/(tabs)/_layout";
import { getPortfolioList } from "@/services/portfolio.service";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, SafeAreaView, useWindowDimensions } from "react-native";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";
import useIsComingFromPortfolioDetail from "@/hooks/useIsComingFromPortfolioDetail";
import { EnergyTypeEnum, ScreenNameEnum } from "@/types/chart.type";

const Portfolio: React.FC = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const { height } = useWindowDimensions();
	const isFromDetail = useIsComingFromPortfolioDetail();
	const insets = useSafeAreaInsets();

	const {
		data: portfolioData,
		error,
		loading,
		isOnline,
		refetch,
	} = useNetworkAwareApiRequest(getPortfolioList, {
		autoFetch: !isFromDetail,
		enabled: !isFromDetail,
		showGlobalLoader: false,
		deps: [isFocused],
	});

	const gasList = portfolioData?.gas || [];
	const stromList = portfolioData?.strom || [];

	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (portfolioData?.gas?.length === 0) return <NoData />;

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{
				marginTop: isIdRoute ? insets.top : 0,
			}}
		>
			<FlatListBlock
				title={EnergyTypeEnum.GAS}
				items={gasList}
				enableAutoScroll={!isFromDetail}
				height={Platform.OS === "web" ? height * 0.45 : "50%"}
				renderType={ScreenNameEnum.PORTFOLIO}
				keyExtractor={(item: Portfolioprops, index: number | string) =>
					item?.PortfolioId.toString()
				}
			/>
			<FlatListBlock
				title={EnergyTypeEnum.POWER}
				items={stromList}
				enableAutoScroll={!isFromDetail}
				height={Platform.OS === "web" ? height * 0.45 : "50%"}
				renderType={ScreenNameEnum.PORTFOLIO}
				keyExtractor={(item: Portfolioprops, index: number | string) =>
					item?.PortfolioId.toString()
				}
			/>
		</SafeAreaView>
	);
};

export default Portfolio;
