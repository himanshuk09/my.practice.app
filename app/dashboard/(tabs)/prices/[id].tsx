import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { FontAwesome5 } from "@expo/vector-icons";
import { RootState } from "@/store/store";
import { fetchDataByToggle } from "@/services/auth.services";
import { st } from "@/utils/Styles";
import {
	saveCSVToFileWeb,
	saveCSVToFileString,
} from "@/components/ConstantFunctions/saveCSVFile";
import { cockpitChartData } from "@/constants/cockpitchart";
import { ChartShimmer } from "@/components/ChartShimmer";
import { stringChartData } from "@/constants/stringChartData";

const PricesDetails = () => {
	const { id } = useLocalSearchParams();
	const [pricesDetail, setPricesDetails] = useState<any>([]);
	const [isChartLoaded, setIsChartLoaded] = useState<any>(false);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	useEffect(() => {
		const filteredItem = PricesItem.filter(
			(item: any) => item.id === Number(id)
		);
		setTimeout(() => {
			setPricesDetails(filteredItem[0]);
		}, 1000);
	}, [id]);

	const getCurrentUTCDateTime = () => {
		const now = new Date();
		// Extract UTC components
		const day = String(now.getUTCDate()).padStart(2, "0");
		const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
		const year = now.getUTCFullYear();
		const hours = String(now.getUTCHours()).padStart(2, "0");
		const minutes = String(now.getUTCMinutes()).padStart(2, "0");

		// Format as DD/MM/YYYY HH:mm
		return `${day}/${month}/${year} ${hours}:${minutes}`;
	};

	const fetchChartData = async (tab: string) => {
		try {
			return fetchDataByToggle(tab);
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	useEffect(() => {
		dispatch(inActiveLoading());
	}, [isFocused]);
	return (
		<SafeAreaView className="flex-1 ">
			<StatusBar
				barStyle="dark-content"
				backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{pricesDetail <= 0 ? (
				<View className="flex-1  bg-white">
					<ChartShimmer />
				</View>
			) : (
				<View className="flex-1  bg-white">
					{/* Header Section */}
					{!isLandscape && (
						<View
							className="flex justify-between bg-white flex-row  m-1  h-24 px-3  pt-3 pl-5"
							style={[st.headerShadow, st.bottomShadow]}
						>
							<View className="flex-col">
								<Text className="text-xl break-words font-bold text-mainCardHeaderText">
									{pricesDetail?.title}
								</Text>
								<View className="flex-row justify-between w-[90%]">
									<Text className=" text-md text-mainCardHeaderText ">
										{getCurrentUTCDateTime()}
									</Text>
									<Text className="text-mainCardHeaderText  text-sm font-normal">
										{pricesDetail?.unit} €/MWh
									</Text>
								</View>
							</View>

							<View className="px-2 justify-start ">
								<FontAwesome5
									classname="mr-2"
									name="file-download"
									size={30}
									color="#e31837"
									onPress={() => {
										if (Platform.OS === "web") {
											saveCSVToFileWeb(
												cockpitChartData
											);
										} else {
											saveCSVToFileString(
												stringChartData
											);
										}
									}}
								/>
							</View>
						</View>
					)}
					<ToggleChartComponent
						showRangePicker={true}
						showPeriodOfTime={true}
						showValueRange={false}
						fetchChartData={fetchChartData}
						setIsChartLoaded={setIsChartLoaded}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

export default PricesDetails;
