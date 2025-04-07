import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import WebView from "react-native-webview";
import dayjs, { Dayjs } from "dayjs";
import { inActiveLoading } from "@/store/navigationSlice";
import TabToggleButtons from "@/components/TabToggleButtons";
import ChartComponent from "@/components/Chart/ChartComponent";
import { i18n } from "@/localization/config";
import { ChartLoaderPNG } from "@/components/Loader";
import PickerModel from "@/components/PickerModel";
import { RootState } from "@/store/store";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { filterDataByDateRange } from "@/components/Chart/filterFunction";
import {
	updateApexChart,
	updateEmptyChart,
} from "./Chart/chartUpdateFunctions";
import webviewLineHtmlContent from "@/components/Chart/config/Linechart.android";
import iframeLineHtmlContent from "@/components/Chart/config/Linechart.web";
import { DateType } from "react-native-ui-datepicker";
import { iFrameLineHtmlcontent } from "./Chart/charthtmlcontent";

type tabsType = "Day" | "Week" | "Month" | "Quarter" | "Year" | "Year_3" | "";
type ToggleChartComponentProps = {
	isSignaleScreen?: boolean;
	bottonTitle?: string;
	showRangePicker?: boolean;
	showPeriodOfTime?: boolean;
	showValueRange?: boolean;
	visibleTabs?: any;
	fetchChartData?: any;
	yaxisunit?: string;
	isChartLoaded?: boolean;
	setIsChartLoaded?: any;
};

const ToggleChartComponent = ({
	isSignaleScreen = false,
	bottonTitle = "Customize_View",
	showRangePicker,
	showPeriodOfTime,
	showValueRange,
	visibleTabs,
	fetchChartData,
	yaxisunit = "€/MWh",
	isChartLoaded,
	setIsChartLoaded,
}: ToggleChartComponentProps) => {
	const dispatch = useDispatch();
	let title = i18n.t("Energy_Use");
	const isFirstRender = useRef(true);
	const webViewRef = useRef<WebView | any>(null);
	const iFrameRef = useRef<HTMLIFrameElement | any>(null);
	const LoaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const locale = useSelector((state: any) => state.language.locale);
	const isLandscape = useSelector(
		(state: RootState) => state.orientation.isLandscape
	);
	const [isLoading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<tabsType>("Year");
	const [previousTab, setPreviousTab] = useState<tabsType>("Year");
	const [selectedStartDate, setSelectedStartDate] = useState<
		Dayjs | DateType | any
	>(dayjs());
	const [selectedEndDate, setSelectedEndDate] = useState<
		Dayjs | DateType | any
	>(dayjs().add(7, "day"));
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

	const updateChartData = (filteredData: any) => {
		if (filteredData?.length === 0) {
			updateEmptyChart(webViewRef, iFrameRef);
			setIsChartEmpty(true);
			return;
		}

		if (isTooltipEnabled) {
			updateApexChart("options", webViewRef, iFrameRef, {
				markers: { size: 0 },
			});
			setIsTooltipEnabled(false);
		}

		const isYearlyView =
			["Year", "Quarter", "Year_3"].includes(activeTab) ||
			["Year", "Quarter", "Year_3"].includes(previousTab);

		if (isChartZoomed) {
			webViewRef?.current?.injectJavaScript(
				"window.resetZoom(); true;"
			);
			setIschartZoomed(false);
			if (!isYearlyView) setLoading(true);
		}

		const chartOptions = {
			chart: { animations: { enabled: !isYearlyView } },
			grid: { show: true },
		};

		updateApexChart(
			"chart",
			webViewRef,
			iFrameRef,
			filteredData,
			chartOptions
		);

		if (iFrameRef?.current?.contentWindow?.isChartZoomed?.()) {
			iFrameRef.current.contentWindow.resetZoom();
		}

		setIsChartEmpty(false);
	};

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

	const handleRangeDataFilter = () => {
		let rangeFilterData = filterDataByDateRange(
			selectedStartDate.toISOString(),
			selectedEndDate.toISOString()
		);
		if (rangeFilterData?.length === 0) {
			updateEmptyChart(webViewRef, iFrameRef);
			setActiveTab("");
			setIsChartEmpty(true);
			return;
		} else {
			if (isChartZoomed) {
				webViewRef?.current.injectJavaScript(
					"window.resetZoom(); true;"
				);
				setIschartZoomed(false);
			}
			updateApexChart(
				"chart",
				webViewRef,
				iFrameRef,
				rangeFilterData,
				{
					chart: {
						animations: {
							enabled: false,
						},
					},
					grid: {
						show: true,
					},
				}
			);
			setActiveTab("");
			setIsChartEmpty(false);
		}
	};

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
				LoaderTimeoutRef.current = setTimeout(
					() => setLoading(false),
					500
				);
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
				setMaxMinValues(values);
			default:
				break;
		}
		//console.log("message from webview line chart ", action, values, reason, isZoomed);
	};

	const fetchData = async () => {
		if (fetchChartData && activeTab !== "") {
			try {
				const data = await fetchChartData(activeTab);
				updateLocale();
				updateChartData(data);
				setPreviousTab(activeTab);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	};

	useEffect(() => {
		const executeAfterRender = async () => {
			if (isFirstRender.current) {
				setTimeout(() => {
					fetchData();
					isFirstRender.current = false;
				}, 1000);
				dispatch(inActiveLoading());
			} else {
				fetchData();
			}
		};
		if (isChartLoaded) executeAfterRender();
	}, [activeTab, fetchChartData, locale, isChartLoaded]);
	return (
		<View className="flex-1  bg-white">
			{!isLandscape ? (
				<TabToggleButtons
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					setLoading={setLoading}
				/>
			) : (
				<FloatingActionMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					visibleTabs={visibleTabs}
					setLoading={setLoading}
				/>
			)}
			{/* Chart  */}
			<View className="flex-1  border-gray-300">
				{isLoading && <ChartLoaderPNG />}
				<ChartComponent
					isChartEmpty={isChartEmpty}
					webViewRef={webViewRef}
					iFrameRef={iFrameRef}
					onMessage={onMessage}
					activeTab={activeTab}
					webViewhtmlContent={webviewLineHtmlContent}
					iFramehtmlContent={iframeLineHtmlContent}
					// iFramehtmlContent={iFrameLineHtmlcontent}
					setLoading={setLoading}
					isTooltipEnabled={isTooltipEnabled}
					setIsChartLoaded={setIsChartLoaded}
					setMaxMinValues={setMaxMinValues}
				/>
			</View>

			{/* Bottom Button */}
			{!isLandscape && !isSignaleScreen && (
				<>
					<TouchableOpacity
						className="bg-[#e31836] py-2 mx-5 rounded-sm my-2"
						onPress={() => setModalVisible(!modalVisible)}
						// onPress={ZoomData}
					>
						<Text className="text-white text-center text-base font-normal uppercase">
							{i18n.t(bottonTitle)}
						</Text>
					</TouchableOpacity>
					<PickerModel
						maxMinValues={maxMinValues}
						setMaxMinValues={setMaxMinValues}
						showRangePicker={showRangePicker}
						showPeriodOfTime={showPeriodOfTime}
						showValueRange={showValueRange}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						selectedStartDate={selectedStartDate}
						selectedEndDate={selectedEndDate}
						setSelectedStartDate={setSelectedStartDate}
						setSelectedEndDate={setSelectedEndDate}
						handleRangeDataFilter={handleRangeDataFilter}
					/>
				</>
			)}
		</View>
	);
};

export default ToggleChartComponent;
