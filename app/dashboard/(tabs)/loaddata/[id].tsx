import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import dayjs from "dayjs";
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import { tabsType } from "@/types/chart.type";
import { i18n } from "@/localization/config";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalSearchParams } from "expo-router";
import useTabDataCache from "@/hooks/useTabDataCache";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";
import DownloadFIleIcon from "@/components/ui/DownloadFIleIcon";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { EnergyDataRequest, getLoadDataTS } from "@/services/loaddata.service";
import {
	DATE_FORMAT_PATTERNS,
	UNIT_PLACEHOLDER,
} from "@/utils/dateformatter.utils";

const LoadDataDetails = () => {
	const isFocused = useIsFocused();
	const dispatch = useDispatch();
	const { id, title } = useLocalSearchParams();
	const [loadDetail, setloadDetails] = useState<any>({});
	const [activeTabForFileName, setActiveTabForFileName] =
		useState<tabsType>("Week");
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const locale = useSelector((state: RootState) => state.culture.locale);
	const { fetchWithCache } = useTabDataCache();

	const [debouncedExport, showIcon] = useDebounce(
		(data: any, name: string) => {
			if (!data || data.length === 0) return;

			const filename = `_${name}_${dayjs().format(DATE_FORMAT_PATTERNS.DATE_TIME_FULL_DASHED)}`;

			Platform.OS === "web"
				? exportTimeseriesToCSVForWeb(data, filename)
				: exportTimeseriesToCSV(data, filename);
		},
		200
	);

	const fetchChartData = useCallback(
		async (tab: string, payload: any) => {
			try {
				let fullPayload: EnergyDataRequest = {
					...JSON.parse(decodeURIComponent(id as string)),
					TimeFrame: tab,
					...payload,
				};
				const data = await fetchWithCache(fullPayload, getLoadDataTS);
				setloadDetails(data);
				return data;
			} catch (error) {
				console.error("Failed to load:", error);
				return {};
			}
		},
		[fetchWithCache, id]
	);

	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused, id]);

	return (
		<SafeAreaView className="flex-1 bg-white">
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
										)} `
									: "0 "}{" "}
								{UNIT_PLACEHOLDER.PLACEHOLDER_KWH_UNIT}
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
										}).format(loadDetail.AverageValue)}`
									: "0"}{" "}
								{UNIT_PLACEHOLDER.PLACEHOLDER_KWH_UNIT}
							</Text>
						</View>
					</View>

					<View className="px-2 justify-start pt-5">
						<DownloadFIleIcon
							onPress={() =>
								debouncedExport(
									loadDetail?.data,
									activeTabForFileName
								)
							}
							showIcon={showIcon}
							height={30}
							width={50}
						/>
					</View>
				</View>
			)}

			{/**chart component */}
			<ToggleChartComponent
				screenName={"loaddata"}
				fetchChartData={fetchChartData}
				yaxisunit={UNIT_PLACEHOLDER.PLACEHOLDER_KWH_UNIT}
				setActiveTabForFileName={setActiveTabForFileName}
			/>
		</SafeAreaView>
	);
};

export default LoadDataDetails;
