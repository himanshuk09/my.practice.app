import React, { useEffect, useLayoutEffect, useState } from "react";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { Platform, SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { getPortfolioList } from "@/services/portfolio.service";
import { Portfolioprops, PortfolioArray } from "@/types/type";
import useNetworkStatus from "@/hooks/useNetworkStatus";

const Portfolio: React.FC = () => {
	const [gasList, setGasList] = useState<PortfolioArray>([]);
	const [stromList, setStromList] = useState<PortfolioArray>([]);
	const isOnline = useNetworkStatus();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	let NavigateTo = "dashboard/portfolio";

	useEffect(() => {
		const fetchDetails = async () => {
			if (!isOnline) return;
			else {
				try {
					const response: any = await getPortfolioList();
					setGasList(response?.gas);
					setStromList(response?.strom);
				} catch (error) {
					console.log("Error fetching portfolio list:", error);
				}
			}
		};

		fetchDetails();
	}, [isOnline]);

	useLayoutEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView>
			<StatusBar
				barStyle="dark-content"
				backgroundColor="#C3C3C3"
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			<FlatListBlock
				title="Gas"
				items={gasList || []}
				height={Platform.OS === "web" ? 343 : "50%"}
				NavigateTo={NavigateTo}
				renderType={"Portfolio"}
				keyExtractor={(item: Portfolioprops) =>
					item?.PortfolioId.toString()
				}
			/>
			<FlatListBlock
				title="Power"
				items={stromList || []}
				height={Platform.OS === "web" ? 380 : "50%"}
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
