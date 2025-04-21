import dayjs from "dayjs";
dayjs.extend(customParseFormat);
import { RootState } from "@/store/store";
import WebView from "react-native-webview";
import { i18n } from "@/localization/config";
import { ChartGraphSimmer } from "./ChartShimmer";
import PickerModel from "@/components/PickerModel";
import { ChartLoaderPNG } from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import TabToggleButtons from "@/components/TabToggleButtons";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ChartComponent from "@/components/Chart/ChartComponent";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import {
	updateApexChart,
	updateEmptyChart,
} from "@/components/Chart/chartUpdateFunctions";
import iframeLineHtmlContent from "@/components/Chart/config/Linechart.web";
import webviewLineHtmlContent from "@/components/Chart/config/Linechart.android";

type tabsType = "Day" | "Week" | "Month" | "Quarter" | "Year" | "Year_3" | "";

const formatNumber = (value: number, locale: string): string => {
	return new Intl.NumberFormat(locale, {
		useGrouping: false,
		// minimumFractionDigits: 0,
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
		locale === "de" ? value?.replace(/\./g, "").replace(",", ".") : value;
	return parseFloat(normalized);
};

type ToggleChartComponentProps = {
	isSignaleScreen?: boolean;
	bottonTitle?: string;
	showRangePicker?: boolean;
	showValueRange?: boolean;
	visibleTabs?: any;
	fetchChartData?: any;
	yaxisunit?: string;
	isChartLoaded?: boolean;
	setIsChartLoaded?: any;
};

const ToggleChartComponent = ({
	isSignaleScreen = false,
	isChartLoaded,
	visibleTabs,
	fetchChartData,
	setIsChartLoaded,
	showRangePicker,
	showValueRange,
	yaxisunit = "€/MWh",
	bottonTitle = "Customize_View",
}: ToggleChartComponentProps) => {
	const dispatch = useDispatch();
	let title = i18n.t("Energy_Use");
	const isFirstRender = useRef(true);
	const webViewRef = useRef<WebView | any>(null);
	const iFrameRef = useRef<HTMLIFrameElement | any>(null);
	const LoaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const locale = useSelector((state: any) => state.culture.locale);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const [isLoading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<tabsType>("Week");
	const [previousTab, setPreviousTab] = useState<tabsType>("Week");
	const [selectedStartDate, setSelectedStartDate] = useState<any>(); //yyyy-mm-dd hh:mm
	const [selectedEndDate, setSelectedEndDate] = useState<any>(); //yyyy-mm-dd hh:mm
	const [maxMinValues, setMaxMinValues] = useState<any>({
		minX: 0,
		minY: 0,
		maxX: 0,
		maxY: 0,
	});
	const [modalVisible, setModalVisible] = useState(false);
	const [isChartZoomed, setIschartZoomed] = useState(false);
	const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);
	const [isChartEmpty, setIsChartEmpty] = useState(false);
	const [showchart, setShowChart] = useState<boolean>(false);

	//convert yyyy-mm-dd hh:mm to mm-dd-yyyy hh:mm
	const convertDateTime = (input: any) => {
		const [month, day, yearAndTime] = input.split("/");
		const [year, time] = yearAndTime.split(" ");
		const originalDate = new Date(`${year}-${month}-${day}T${time}`);
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
				setLoading(true);
				break;

			case "stopLoader":
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
				setShowChart(true);
				break;
			case "Empty Series":
				setShowChart(true);
				break;
			default:
				break;
		}
		// console.log(
		// 	"msg from webview line chart",
		// 	action,
		// 	values,
		// 	reason,
		// 	isZoomed
		// );
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

		const isYearlyView = false;
		// ["Year", "Quarter", "Year_3"].includes(activeTab) ||
		// ["Year", "Quarter", "Year_3"].includes(previousTab)

		// if (isChartZoomed) {
		// 	webViewRef?.current?.injectJavaScript("window.resetZoom(); true;");
		// 	setIschartZoomed(false);
		// 	if (!isYearlyView) setLoading(true);
		// }

		const chartOptions = {
			chart: { animations: { enabled: !isYearlyView } },
			grid: { show: true },
		};

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
			if (webViewRef?.current) {
				const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}','${yaxisunit}');}`;
				const updateFormateScript = `if (typeof updateFormate === 'function') {updateFormate('${activeTab}','${locale}');}`;
				webViewRef.current.injectJavaScript(updateLocaleScript);
				webViewRef.current.injectJavaScript(updateFormateScript);
			}
		}
	};

	//its used to handle custom data
	const handleRangeDataFilter = async () => {
		setActiveTab("");
		fetchData({
			TimeFrame: 6,
			MinValue: formatNumber(
				parseNumber(maxMinValues?.minY, locale),
				"en"
			),
			MaxValue: formatNumber(
				parseNumber(maxMinValues?.maxY, locale),
				"en"
			),
			StartDate: formatDateTime(dayjs(selectedStartDate)),
			EndDate: formatDateTime(dayjs(selectedEndDate)),
		});
	};

	const fetchData = async (rangePayload = {}) => {
		if (fetchChartData) {
			try {
				const chartConfig = await fetchChartData(
					activeTab,
					rangePayload
				);
				if (chartConfig?.data?.length > 0) {
					updateChartData(chartConfig?.data);
					setPreviousTab(activeTab);
					updateLocale();
					setSelectedStartDate(
						convertDateTime(chartConfig?.data[0]?.x)
					);
					setSelectedEndDate(
						convertDateTime(
							chartConfig?.data[chartConfig.data.length - 1]?.x
						)
					);
					setMaxMinValues({
						minX: 0,
						minY: new Intl.NumberFormat(locale, {
							useGrouping: false,
							// minimumFractionDigits: 0,
							maximumFractionDigits: 2,
						}).format(chartConfig?.MinValue),
						maxX: 0,
						maxY: new Intl.NumberFormat(locale, {
							useGrouping: false,
							// minimumFractionDigits: 0,
							maximumFractionDigits: 2,
						}).format(chartConfig?.MaxValue),
					});
				} else {
					updateChartData([]);
					setSelectedStartDate("");
					setSelectedEndDate("");
					setMaxMinValues({
						minX: 0,
						minY: 0,
						maxX: 0,
						maxY: 0,
					});
				}
				// setShowChart(true);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			if (isChartLoaded && activeTab !== "") {
				setLoading(true);
				fetchData();
			}
		}, 300);

		return () => clearTimeout(handler);
	}, [activeTab]);

	useEffect(() => {
		if (isChartLoaded) {
			fetchData();
		}
	}, [locale, isChartLoaded]);

	return (
		<View className="flex-1  bg-white">
			{!isLandscape ? (
				<TabToggleButtons
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					isLoading={isLoading}
					setLoading={setLoading}
				/>
			) : (
				<FloatingActionMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					isLoading={isLoading}
					setLoading={setLoading}
				/>
			)}
			{/* Chart  */}
			<View className="flex-1  border-gray-300">
				{!showchart && <ChartGraphSimmer />}
				{isLoading && <ChartLoaderPNG />}
				<ChartComponent
					isChartEmpty={isChartEmpty}
					webViewRef={webViewRef}
					iFrameRef={iFrameRef}
					onMessage={onMessage}
					activeTab={activeTab}
					webViewhtmlContent={webviewLineHtmlContent}
					iFramehtmlContent={iframeLineHtmlContent}
					setShowChart={setShowChart}
					setLoading={setLoading} // for web
					isTooltipEnabled={isTooltipEnabled}
					setIsChartLoaded={setIsChartLoaded}
					setMaxMinValues={setMaxMinValues}
				/>
			</View>
			{/* Bottom Button */}
			{!isLandscape && !isSignaleScreen && (
				<React.Fragment>
					<TouchableOpacity
						className="bg-[#e31836] py-3 mx-5 rounded-sm mb-2"
						onPress={() => setModalVisible(!modalVisible)}
						disabled={!showchart}
					>
						<Text className="text-white text-center text-base font-normal uppercase">
							{i18n.t(bottonTitle)}
						</Text>
					</TouchableOpacity>
					<PickerModel
						maxMinValues={maxMinValues}
						setMaxMinValues={setMaxMinValues}
						showRangePicker={showRangePicker}
						showValueRange={showValueRange}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						selectedStartDate={selectedStartDate}
						setSelectedStartDate={setSelectedStartDate}
						selectedEndDate={selectedEndDate}
						setSelectedEndDate={setSelectedEndDate}
						handleRangeDataFilter={handleRangeDataFilter}
					/>
				</React.Fragment>
			)}
		</View>
	);
};

export default ToggleChartComponent;
