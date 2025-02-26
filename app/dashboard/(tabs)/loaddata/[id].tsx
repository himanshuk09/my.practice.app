import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AccordionData } from "@/constants/constantData";
import { useSelector } from "react-redux";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { i18n } from "@/localization/localConfig";
import { cockpitChartData } from "@/constants/cockpitchart";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { RootState } from "@/store/store";
import {
	saveCSVToFileString,
	saveCSVToFileWeb,
} from "@/components/fileDownloaders/saveCSVFile";
import { fetchDataByToggle } from "@/services/auth.services";
import { ChartShimmer } from "@/components/ChartShimmer";
import { stringChartData } from "@/constants/stringChartData";
import { st } from "@/utils/Styles";

const LoadDataDetails = () => {
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
	const [loadDetail, setloadDetails] = useState<any>([]);
	const { id } = useLocalSearchParams();
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	const fetchChartData = async (tab: string) => {
		try {
			return fetchDataByToggle(tab);
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	useEffect(() => {
		const filteredItem = AccordionData.find((item: any) =>
			item.details.some((detail: any) => detail.id === Number(id))
		);

		if (filteredItem) {
			const selectedDetail = filteredItem.details.find(
				(detail: any) => detail.id === Number(id)
			);
			setTimeout(() => {
				setloadDetails(selectedDetail);
			}, 1000);
		} else {
			setloadDetails(null);
			console.warn("No matching detail found");
		}
	}, [id]);

	return (
		<SafeAreaView className="flex-1 ">
			<StatusBar
				barStyle="dark-content"
				backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
				animated
				showHideTransition={"slide"}
				networkActivityIndicatorVisible
			/>
			{loadDetail <= 0 ? (
				<View className="flex-1  bg-white">
					<ChartShimmer />
				</View>
			) : (
				<View className="flex-1  bg-white">
					{!isLandscape && (
						<View
							className="flex justify-between bg-white  flex-row px-3 pl-5 py-1 mb-1 h-28 "
							style={[st.headerShadow, st.bottomShadow]}
						>
							<View
								className="flex-col py-1"
								style={{
									width:
										Platform.OS === "web"
											? "90%"
											: "85%",
								}}
							>
								<Text className="text-sm font-semibold text-mainCardHeaderText break-words">
									{loadDetail?.channel}
								</Text>
								<View className="flex-row justify-items-start">
									<Text className="text-mainCardHeaderText text-md">
										{i18n.t("Energy")}:{" "}
									</Text>
									<Text className="text-mainCardHeaderText text-sm ml-5">
										{new Intl.NumberFormat("en", {
											useGrouping: true,
										}).format(30319)}{" "}
										kWh
									</Text>
								</View>
								<View className="flex-row justify-items-start  ">
									<Text className="text-mainCardHeaderText text-md">
										{i18n.t("Average")}:{" "}
									</Text>
									<Text className="text-mainCardHeaderText text-sm ml-5">
										30,319 kWh
									</Text>
								</View>
							</View>
							<View className="px-2 justify-start pt-5">
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
					{/**chart component */}
					<ToggleChartComponent
						showRangePicker={false}
						showPeriodOfTime={true}
						showValueRange={true}
						fetchChartData={fetchChartData}
						yaxisunit={"€/MWh"}
						isChartLoaded={isChartLoaded}
						setIsChartLoaded={setIsChartLoaded}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

export default LoadDataDetails;
