import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, useWindowDimensions } from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import { getPortfolioList } from "@/services/portfolio.service";
import { useNetworkAwareApiRequest } from "@/hooks/useNetworkAwareApiRequest";

import { Portfolioprops } from "@/types/type";
import NoNetwork from "@/components/icons/NoNetwork";
import NoData from "@/components/icons/NoData";
import useIsComingFromPortfolioDetail from "@/hooks/useIsComingFromPortfolioDetail";

const Portfolio: React.FC = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const { height } = useWindowDimensions();
	const NavigateTo = "dashboard/portfolio";
	const isFromDetail = useIsComingFromPortfolioDetail();

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

	useLayoutEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);

	/**
	 *
	 * Return Based On Condition
	 */
	if (error) return <NoNetwork />;
	if (portfolioData?.gas?.length === 0) return <NoData />;

	return (
		<SafeAreaView className="flex-1 bg-white">
			<FlatListBlock
				title="Gas"
				items={gasList}
				enableAutoScroll={!isFromDetail}
				height={Platform.OS === "web" ? height * 0.45 : "50%"}
				NavigateTo={NavigateTo}
				renderType={"Portfolio"}
				keyEndxtractor={(item: Portfolioprops) =>
					item?.PortfolioId.toString()
				}
			/>
			<FlatListBlock
				title="Power"
				items={stromList}
				enableAutoScroll={!isFromDetail}
				height={Platform.OS === "web" ? height * 0.45 : "50%"}
				NavigateTo={NavigateTo}
				renderType={"Portfolio"}
				keyExtractor={(item: Portfolioprops) =>
					item?.PortfolioId.toString()
				}
			/>
		</SafeAreaView>
	);
};

export default Portfolio;
