import React, { useEffect, useLayoutEffect, useState } from "react";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { Platform, SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { getPortfolioList } from "@/services/portfolio.service";

const Portfolio: React.FC = () => {
	const [gasList, setGasList] = useState<any>([]);
	const [stromList, setStromList] = useState<any>([]);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	let NavigateTo = "dashboard/portfolio";

	const filterByEnergyType = (data: any[] = []) => {
		return data.reduce(
			(acc, item) => {
				if (item.EnergyType === 1) {
					acc.strom.push(item);
				} else if (item.EnergyType === 2 || item.EnergyType === 5) {
					acc.gas.push(item);
				}
				return acc;
			},
			{ gas: [] as any[], strom: [] as any[] }
		);
	};

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const response: any = await getPortfolioList();

				if (Array.isArray(response)) {
					const filteredData = filterByEnergyType(response);
					setGasList(filteredData?.gas);
					setStromList(filteredData?.strom);
				} else {
					console.log("Unexpected API response format");
				}
			} catch (error) {
				console.log("Error fetching portfolio list:", error);
			}
		};

		fetchDetails();
	}, []);

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
				items={gasList}
				height={Platform.OS === "web" ? 343 : "50%"}
				NavigateTo={NavigateTo}
				renderType={"Portfolio"}
				keyExtractor={(item: any) => item?.PortfolioId.toString()}
			/>
			<FlatListBlock
				title="Power"
				items={stromList}
				height={Platform.OS === "web" ? 380 : "50%"}
				NavigateTo={NavigateTo}
				renderType={"Portfolio"}
				keyExtractor={(item: any) => item?.PortfolioId.toString()}
			/>
		</SafeAreaView>
	);
};

export default Portfolio;
