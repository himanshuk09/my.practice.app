import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/chart/chartUpdateFunctions";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
import { RootState } from "@/store/store";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import PickerModel from "@/components/PickerModel";
import { ChartLoaderPNG } from "@/components/Loader";
import { DateType } from "react-native-ui-datepicker";
import React, { useEffect, useRef, useState } from "react";
import TabToggleButtons from "@/components/TabToggleButtons";
import { ChartGraphSimmer } from "@/components/ChartShimmer";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ChartComponent from "@/components/chart/ChartComponent";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { englishLocale, germanyLocale, i18n } from "@/localization/config";
import iframeLineHtmlContent from "@/components/chart/config/Linechart.web";
import webviewLineHtmlContent from "@/components/chart/config/Linechart.android";

export type tabsType =
	| "Day"
	| "Week"
	| "Month"
	| "Quarter"
	| "Year"
	| "Year_3"
	| "";
type ToggleChartComponentProps = {
	visibleTabs?: tabsType[];
	fetchChartData?: any;
	showRangePicker?: boolean;
	showValueRange?: boolean;
	yaxisunit?: string;
	isSignaleScreen?: boolean;
	setActiveTabForFileName?: React.Dispatch<React.SetStateAction<string>>;
};
const formatNumber = (value: number, locale: string): string => {
	return new Intl.NumberFormat(locale, {
		useGrouping: false,
		maximumFractionDigits: 2,
	}).format(value);
};

const parseNumber = (
	value: string | number | null | undefined | any,
	locale: string
): number => {
	if (value === null || value === undefined || value === 0) {
		return 0;
	}
	const normalized =
		locale === germanyLocale
			? value?.replace(/\./g, "").replace(",", ".")
			: value;
	return parseFloat(normalized);
};

//convert mm/dd/yyy  hh:mm to string
const convertDateTime = (input: string) => {
	const [datePart, timePart] = input.split(" "); // ["05/28/2025", "00:00"]
	const [month, day, year] = datePart.split("/"); // ["05", "28", "2025"]

	const isoString = `${year}-${month}-${day}T${timePart}`; // "2025-05-28T00:00"
	const originalDate = new Date(isoString);

	return dayjs(originalDate);
};

// formate to dd■mm■$yy■hh■mm
function formatDateTime(input: any) {
	const date = new Date(input);
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${day}■${month}■${year}■${hours}■${minutes}`;
}

const ToggleChartComponent = ({
	visibleTabs,
	fetchChartData,
	showRangePicker,
	showValueRange,
	yaxisunit = "€/MWh",
	isSignaleScreen = false,
	setActiveTabForFileName = () => "cockpit",
}: ToggleChartComponentProps) => {
	// Hooks and state initialization
	const insets = useSafeAreaInsets();
	const isOnline = useSelector(
		(state: RootState) => state.network.isConnected
	);
	const locale = useSelector((state: RootState) => state.culture.locale);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);

	// Refs
	const webViewRef = useRef<WebView | any>(null);
	const iFrameRef = useRef<HTMLIFrameElement | any>(null);
	const LoaderTimeoutRef = useRef<NodeJS.Timeout | number>(null);

	// State
	const [activeTab, setActiveTab] = useState<tabsType>("Week");
	const [range, setRange] = useState<{
		startDate: DateType | any;
		endDate: DateType | any;
	}>({
		startDate: dayjs().subtract(1, "month"),
		endDate: dayjs().add(1),
	});
	const [maxMinValues, setMaxMinValues] = useState<{
		minX: number | string;
		minY: number | string;
		maxX: number | string;
		maxY: number | string;
	}>({
		minX: 0,
		minY: 0,
		maxX: 0,
		maxY: 0,
	});

	//booleans toggle states
	const [isLoading, setLoading] = useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [isChartEmpty, setIsChartEmpty] = useState<boolean>(false);
	const [isChartZoomed, setIschartZoomed] = useState<boolean>(false);
	const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
	const [showChartShimmer, setShowChartShimmer] = useState<boolean>(true);
	const [isTooltipEnabled, setIsTooltipEnabled] = useState<boolean>(false);

	//its trigger by webview on charts operations
	const onMessage = async (event: any) => {
		const message = JSON.parse(event.nativeEvent.data);
		const { action, values, reason, isZoomed } = message;

		switch (action) {
			case "updateChartSeries":
			case "updateChartOptions":
				setLoading(true);
				break;

			case "Chart updated":
				if (LoaderTimeoutRef.current)
					clearTimeout(LoaderTimeoutRef.current);
				LoaderTimeoutRef.current = setTimeout(() => {
					setLoading(false);
				}, 300);
				break;

			case "startLoader":
				// setLoading(true);
				break;

			// case "stopLoader":
			case "Empty":
				setTimeout(() => setLoading(false), 2000);
				break;

			case "chartZoomed":
				setIschartZoomed(isZoomed);
				break;

			case "tooltip":
				setIsTooltipEnabled(values);
				break;
			case "highLightedMaxMin":
				//setMaxMinValues(values)
				break;
			case "animationEnd":
				setShowChartShimmer(false);
				break;
			case "Empty Series":
				setShowChartShimmer(false);
				break;
			default:
				break;
		}
	};

	// its used to update chart options and series based on data
	const updateChartData = (filteredData: any) => {
		if (filteredData?.length === 0) {
			updateEmptyChart(webViewRef, iFrameRef);
			setIsChartEmpty(true);
			setTimeout(() => {
				setLoading(false);
			}, 500);
			return;
		}

		if (isTooltipEnabled) {
			updateApexChart("options", webViewRef, iFrameRef, {
				markers: { size: 0 },
			});
			setIsTooltipEnabled(false);
		}

		if (isChartZoomed) {
			webViewRef?.current?.injectJavaScript("window.resetZoom(); true;");
			setIschartZoomed(false);
			setLoading(true);
		}

		updateApexChart("series", webViewRef, iFrameRef, filteredData);

		if (iFrameRef?.current?.contentWindow?.isChartZoomed?.()) {
			iFrameRef.current.contentWindow.resetZoom();
		}

		setIsChartEmpty(false);
	};

	//its used to update charts culture and x axis formate
	const updateLocale = () => {
		if (Platform.OS === "web") {
			const iframe = iFrameRef.current;
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.updateLocale?.(locale);
				iframe.contentWindow.updateFormate?.(activeTab, locale);
			}

			updateApexChart("options", webViewRef, iFrameRef, {
				xaxis: {
					title: { text: i18n.t("datetime") },
				},
			});
		} else {
			const scripts = [
				`if (typeof updateLocale === 'function') updateLocale('${locale}','${yaxisunit}');`,
				`if (typeof updateFormate === 'function') updateFormate('${activeTab}','${locale}');`,
			];
			scripts.forEach((script) =>
				webViewRef.current?.injectJavaScript(script)
			);
		}
	};

	const fetchData = async (rangePayload = {}) => {
		if (!fetchChartData) return;
		try {
			const chartConfig = await fetchChartData(activeTab, rangePayload);
			const chartData = chartConfig?.data || [];
			if (chartData?.length > 0) {
				updateChartData(chartData);
				updateLocale();
				setRange((prev: any) => ({
					...prev,
					startDate: convertDateTime(chartData[0]?.x),
					endDate: convertDateTime(
						chartData[chartData?.length - 1]?.x
					),
				}));
				setMaxMinValues({
					minX: 0,
					minY: new Intl.NumberFormat(locale, {
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 2,
					}).format(chartConfig?.MinValue),
					maxX: 0,
					maxY: new Intl.NumberFormat(locale, {
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 2,
					}).format(chartConfig?.MaxValue),
				});
			} else {
				updateChartData([]);
				setRange((prev: any) => ({
					...prev,
					endDate: "",
					startDate: "",
				}));
				setMaxMinValues({
					minX: 0,
					minY: 0,
					maxX: 0,
					maxY: 0,
				});
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	//its used to handle custom data
	const handleRangeDataFilter = async () => {
		setActiveTab("");
		setLoading(true);
		fetchData({
			TimeFrame: 6,
			MinValue: formatNumber(
				parseNumber(maxMinValues?.minY, locale),
				englishLocale
			),
			MaxValue: formatNumber(
				parseNumber(maxMinValues?.maxY, locale),
				englishLocale
			),
			StartDate: formatDateTime(dayjs(range.startDate)),
			EndDate: formatDateTime(dayjs(range.endDate)),
		});
	};

	// useEffect(() => {
	// 	const handler = setTimeout(() => {
	// 		if (isChartLoaded && activeTab !== "" && isOnline) {
	// 			setLoading(true);
	// 			fetchData();
	// 			setActiveTabForFileName(activeTab);
	// 		}
	// 	}, 300);

	// 	return () => clearTimeout(handler);
	// }, [activeTab]);

	// useEffect(() => {
	// 	if (isChartLoaded && isOnline) {
	// 		fetchData();
	// 	}
	// }, [locale, isChartLoaded, isOnline]);

	useEffect(() => {
		if (!isChartLoaded || !isOnline || activeTab === "") return;
		setLoading(true);
		fetchData();
		setActiveTabForFileName(activeTab);
	}, [activeTab, isChartLoaded, isOnline]);

	return (
		<View
			className="flex-1  bg-white"
			style={{
				marginBottom: insets.bottom,
				marginTop: isLandscape ? insets.top : 0,
				marginRight: insets.right,
				marginLeft: insets.left,
			}}
		>
			{isLandscape ? (
				<FloatingActionMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					isLoading={isLoading}
				/>
			) : (
				<TabToggleButtons
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					isLoading={isLoading}
				/>
			)}
			{/* Chart  */}
			<View className="flex-1  border-gray-300 relative">
				{showChartShimmer && <ChartGraphSimmer />}
				{isLoading && <ChartLoaderPNG />}

				<ChartComponent
					activeTab={activeTab}
					setMaxMinValues={setMaxMinValues}
					//for android
					onMessage={onMessage}
					webViewRef={webViewRef} // reference
					isChartEmpty={isChartEmpty}
					webViewhtmlContent={webviewLineHtmlContent} // for android html string
					isTooltipEnabled={isTooltipEnabled}
					setIsChartLoaded={setIsChartLoaded}
					//for web
					iFrameRef={iFrameRef} // reference
					setShowChartShimmer={setShowChartShimmer} // set for web
					iFramehtmlContent={iframeLineHtmlContent} // for web html string
					setLoading={setLoading} //set for web
				/>
			</View>

			{/* Bottom Button */}
			{!isLandscape && !isSignaleScreen && (
				<React.Fragment>
					<TouchableOpacity
						className="bg-[#e31836] py-3 mx-5 rounded-sm mb-2"
						onPress={() => setModalVisible(!modalVisible)}
					>
						<Text className="text-white text-center text-base font-normal uppercase">
							{i18n.t("Customize_View")}
						</Text>
					</TouchableOpacity>
					<PickerModel
						//min max
						maxMinValues={maxMinValues}
						setMaxMinValues={setMaxMinValues}
						//range picker and value
						showRangePicker={showRangePicker}
						showValueRange={showValueRange}
						//picker state
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						range={range}
						setRange={setRange}
						handleRangeDataFilter={handleRangeDataFilter}
					/>
				</React.Fragment>
			)}
		</View>
	);
};

export default ToggleChartComponent;
