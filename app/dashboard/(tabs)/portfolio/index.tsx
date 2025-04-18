import React, { useEffect, useLayoutEffect, useState } from "react";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import {
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { StatusBar } from "react-native";
import { getPortfolioList } from "@/services/portfolio.service";
import { Portfolioprops, PortfolioArray } from "@/types/type";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { i18n } from "@/localization/config";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const Portfolio: React.FC = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const isOnline = useNetworkStatus();
	let NavigateTo = "dashboard/portfolio";
	const { height } = useWindowDimensions();
	const [error, setError] = useState(false);
	const [gasList, setGasList] = useState<PortfolioArray>([]);
	const [stromList, setStromList] = useState<PortfolioArray>([]);

	useEffect(() => {
		const fetchDetails = async () => {
			if (!isOnline) return;
			else {
				try {
					const response: any = await getPortfolioList();
					if (
						response?.gas.length === 0 ||
						response?.strom.length === 0
					) {
						setError(true);
					} else {
						setGasList(response?.gas);
						setStromList(response?.strom);
						setError(false);
					}
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
				<>
					<FlatListBlock
						title="Gas"
						items={gasList || []}
						height={Platform.OS === "web" ? height * 0.45 : "50%"}
						NavigateTo={NavigateTo}
						renderType={"Portfolio"}
						keyExtractor={(item: Portfolioprops) =>
							item?.PortfolioId.toString()
						}
					/>
					<FlatListBlock
						title="Power"
						items={stromList || []}
						height={Platform.OS === "web" ? height * 0.45 : "50%"}
						NavigateTo={NavigateTo}
						renderType={"Portfolio"}
						keyExtractor={(item: Portfolioprops) =>
							item?.PortfolioId.toString()
						}
					/>
				</>
			)}
		</SafeAreaView>
	);
};

export default Portfolio;
