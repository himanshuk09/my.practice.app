import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import utc from "dayjs/plugin/utc";
import DownloadFIleIcon from "@/components/ui/DownloadFIleIcon";
import { View, Text, SafeAreaView, Platform } from "react-native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { englishLocale } from "@/localization/config";
import {
	DATE_FORMAT_PATTERNS,
	UNIT_PLACEHOLDER,
} from "@/utils/dateformatter.utils";

dayjs.extend(utc);

const PricesDetails = () => {
	const { id } = useLocalSearchParams();
	const [pricesDetail, setPricesDetails] = useState<any>([]);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const { locale } = useSelector((state: RootState) => state.culture);
	const isEng = locale === englishLocale;
	const dateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_TIME_SLASHED_DD_MM_YYYY_HH_MM
		: DATE_FORMAT_PATTERNS.DATE_TIME_DOTTED_DD_MM_YYYY_HH_MM;
	const [debouncedExport, showIcon] = useDebounce(
		(data: any, name: string) => {
			// if (!data || data.length === 0) return;

			const filename = `_${name}_${dayjs().format(DATE_FORMAT_PATTERNS.DATE_TIME_FULL_DASHED)}`;

			Platform.OS === "web"
				? exportTimeseriesToCSVForWeb(data, filename)
				: exportTimeseriesToCSV(data, filename);
		},

		200
	);
	useEffect(() => {
		const filteredItem = PricesItem.filter(
			(item: any) => item.id === Number(id)
		);
		setTimeout(() => {
			setPricesDetails(filteredItem[0]);
		}, 1000);
	}, [id]);

	const fetchChartData = async (tab: string) => {
		try {
			return [];
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};

	useEffect(() => {
		if (isFocused) dispatch(inActiveLoading());
	}, [isFocused]);

	return (
		<SafeAreaView className="flex-1 {/**chart component */}">
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
								{dayjs().utc().format(dateFormate)}
							</Text>
							<Text className="text-mainCardHeaderText  text-sm font-normal">
								{pricesDetail?.unit}{" "}
								{
									UNIT_PLACEHOLDER.PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT
								}
							</Text>
						</View>
					</View>

					<View className="px-2 justify-start ">
						<DownloadFIleIcon
							showIcon={showIcon}
							onPress={debouncedExport}
							size={30}
							height={30}
							width={27}
						/>
					</View>
				</View>
			)}
			{/**chart component */}
			<ToggleChartComponent
				screenName="prices"
				fetchChartData={fetchChartData}
			/>
		</SafeAreaView>
	);
};

export default PricesDetails;
