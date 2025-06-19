import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { cockpitChartData } from "@/constants/cockpitchart";
import { stringChartData } from "@/constants/stringChartData";
import { View, Text, SafeAreaView, Platform } from "react-native";
import ToggleChartComponent from "@/components/ToggleChartComponent";

const PricesDetails = () => {
	const { id } = useLocalSearchParams();
	const [pricesDetail, setPricesDetails] = useState<any>([]);
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
			return [];
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	useEffect(() => {
		if (isFocused) {
			setTimeout(() => {
				dispatch(inActiveLoading());
			}, 500);
		}
	}, [isFocused]);
	return (
		<SafeAreaView className="flex-1 ">
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
										exportTimeseriesToCSVForWeb(
											cockpitChartData
										);
									} else {
										exportTimeseriesToCSV(stringChartData);
									}
								}}
							/>
						</View>
					</View>
				)}
				<ToggleChartComponent
					screenName="prices"
					fetchChartData={fetchChartData}
				/>
			</View>
		</SafeAreaView>
	);
};

export default PricesDetails;
