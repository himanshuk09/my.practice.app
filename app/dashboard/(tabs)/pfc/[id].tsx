import {
	exportTimeseriesToCSV,
	exportTimeseriesToCSVForWeb,
} from "@/components/exportcsv/exporttofile";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { st } from "@/utils/Styles";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { inActiveLoading } from "@/store/navigationSlice";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import DownloadFIleIcon from "@/components/ui/DownloadFIleIcon";
import { View, Text, SafeAreaView, Platform } from "react-native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import { englishLocale } from "@/localization/config";
import { DATE_FORMAT_PATTERNS } from "@/utils/dateformatter.utils";

const PFCDetails = () => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const { id } = useLocalSearchParams();
	const locale = useSelector((state: RootState) => state.culture.locale);

	const [pfcDetails, setPfcDetails] = useState<any>([]);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const isEng = locale === englishLocale;
	const dateFormate = isEng
		? DATE_FORMAT_PATTERNS.DATE_SLASHED_DD_MM_YYYY
		: DATE_FORMAT_PATTERNS.DATE_DOTTED_DD_MM_YYYY;

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
								{dayjs().utc().format(dateFormate)}
							</Text>
						</View>
						<View className="px-2 justify-start">
							<DownloadFIleIcon
								onPress={debouncedExport}
								showIcon={showIcon}
								size={25}
								height={25}
								width={25}
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
