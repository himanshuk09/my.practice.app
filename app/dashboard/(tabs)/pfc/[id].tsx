import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { englishLocale } from "@/localization/config";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { cockpitChartData } from "@/constants/cockpitchart";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import { stringChartData } from "@/constants/stringChartData";
import { View, Text, SafeAreaView, Platform } from "react-native";
import ToggleChartComponent from "@/components/ToggleChartComponent";

const PFCDetails = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const { id } = useLocalSearchParams();
	const locale = useSelector((state: RootState) => state.culture.locale);

	const [pfcDetails, setPfcDetails] = useState<any>([]);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	const getCurrentUTCDateTime = () => {
		const now = new Date();
		// Extract UTC components
		const day = String(now.getUTCDate()).padStart(2, "0");
		const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
		const year = now.getUTCFullYear();
		const hours = String(now.getUTCHours()).padStart(2, "0");
		const minutes = String(now.getUTCMinutes()).padStart(2, "0");

		// Format as DD/MM/YYYY HH:mm
		return locale === englishLocale
			? `${day}/${month}/${year} ${hours}:${minutes}`
			: `${day}.${month}.${year} ${hours}:${minutes}`;
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
		const filteredItem =
			PFCGas.find((item: any) => item.id === Number(id)) ||
			PFCStrom.find((item: any) => item.id === Number(id));
		setTimeout(() => {
			setPfcDetails(filteredItem);
		}, 1000);
	}, [id]);

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
						className="flex justify-between bg-white flex-row  m-1  h-24 px-3 pl-5  pt-3"
						style={[st.headerShadow, st.bottomShadow]}
					>
						<View className="flex-col w-60  ">
							<Text className="text-xl break-words font-bold text-mainCardHeaderText">
								{pfcDetails?.title}
							</Text>
							<Text className=" text-md text-mainCardHeaderText ">
								{getCurrentUTCDateTime()}
							</Text>
						</View>
						<View className="px-2 justify-start">
							<FontAwesome5
								classname="mr-2"
								name="file-download"
								size={30}
								color="#e11935"
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
					screenName="pfc"
					fetchChartData={fetchChartData}
				/>
			</View>
		</SafeAreaView>
	);
};

export default PFCDetails;
