import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import dayjs from "dayjs";
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import { StatusBar } from "expo-status-bar";
import { i18n } from "@/localization/config";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalSearchParams } from "expo-router";
import useTabDataCache from "@/hooks/useTabDataCache";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getLoadDataTS } from "@/services/loaddata.service";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";
import ToggleChartComponent from "@/components/ToggleChartComponent";

const LoadDataDetails = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const { id, title } = useLocalSearchParams();
	const [loadDetail, setloadDetails] = useState<any>({});
	const [activeTabForFileName, setActiveTabForFileName] =
		useState<any>("Week");
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const locale = useSelector((state: RootState) => state.culture.locale);
	const { fetchWithCache } = useTabDataCache();
	const debouncedExport = useDebounce((data: any, name: any) => {
		if (!data || data.length === 0) return;

		const filename = `_${name}_${dayjs().format("DD-MM-YYYY-HH-mm-ss")}`;

		Platform.OS === "web"
			? exportTimeseriesToCSVForWeb(data, filename)
			: exportTimeseriesToCSV(data, filename);
	}, 1000);
	const fetchChartData = useCallback(
		async (tab: string, payload: any) => {
			let fullPayload = {
				...JSON.parse(decodeURIComponent(id as string)),
				TimeFrame: tab,
				...payload,
			};
			const data = await fetchWithCache(fullPayload, getLoadDataTS);
			setloadDetails(data);
			return data;
		},
		[fetchWithCache, id]
	);
	useEffect(() => {
		if (isFocused) {
			setTimeout(() => {
				dispatch(inActiveLoading());
			}, 500);
		}
	}, [isFocused, id]);
	return (
		<SafeAreaView className="flex-1 ">
			<StatusBar
				style="light"
				translucent
				animated
				hideTransitionAnimation="fade"
				networkActivityIndicatorVisible
			/>

			<View className="flex-1  bg-white">
				{!isLandscape && (
					<View
						className="flex justify-between bg-white  flex-row px-3 pl-5 py-1 mb-1"
						style={[st.headerShadow, st.bottomShadow]}
					>
						<View
							className="flex-col p-1"
							style={{
								width: Platform.OS === "web" ? "90%" : "85%",
							}}
						>
							<Text className="text-sm font-semibold text-mainCardHeaderText break-words">
								{title}
							</Text>

							<View className="flex-row justify-self-start">
								<Text className="text-mainCardHeaderText text-md min-w-[80px]">
									{i18n.t("Energy")}:{" "}
								</Text>
								<Text className="text-mainCardHeaderText text-sm ml-2">
									{loadDetail?.MaxMomentum
										? `${new Intl.NumberFormat(locale, {
												useGrouping: true,
												maximumFractionDigits: 0,
											}).format(
												parseFloat(
													loadDetail.MaxMomentum.replace(
														/[^\d.]/g,
														""
													)
												)
											)} kWh`
										: "0 kWh"}
								</Text>
							</View>
							<View className="flex-row justify-items-start">
								<Text className="text-mainCardHeaderText text-md min-w-[80px]">
									{i18n.t("Average")}:{" "}
								</Text>
								<Text className="text-mainCardHeaderText text-sm ml-2">
									{loadDetail?.AverageValue != null
										? `${new Intl.NumberFormat(locale, {
												useGrouping: true,
												maximumFractionDigits: 2,
											}).format(
												loadDetail.AverageValue
											)} kWh`
										: "0 kWh"}
								</Text>
							</View>
						</View>
						<View className="px-2 justify-start pt-5">
							<FontAwesome5
								classname="mr-2"
								name="file-download"
								size={30}
								color="#e31837"
								onPress={() =>
									debouncedExport(
										loadDetail?.data,
										activeTabForFileName
									)
								}
							/>
						</View>
					</View>
				)}
				{/**chart component */}
				<ToggleChartComponent
					showValueRange={true}
					fetchChartData={fetchChartData}
					yaxisunit="kWh"
					setActiveTabForFileName={setActiveTabForFileName}
				/>
			</View>
		</SafeAreaView>
	);
};

export default LoadDataDetails;
