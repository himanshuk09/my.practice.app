import {
	convertDateTime,
	formatDateTime,
	formatNumber,
	parseNumber,
} from "@/utils/formatting-utils";
import {
	updateApexChart,
	updateEmptyApexChart,
	updateLineApexChartLocale,
} from "@/components/chart/chartUpdateFunctions";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
import { View } from "react-native";
import { RootState } from "@/store/store";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import PickerModel from "@/components/PickerModel";
import { ChartLoaderPNG } from "@/components/Loader";
import { DateType } from "react-native-ui-datepicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import React, { useEffect, useRef, useState } from "react";
import TabToggleButtons from "@/components/TabToggleButtons";
import { ChartGraphShimmer } from "@/components/ChartShimmer";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ChartComponent from "@/components/chart/ChartComponent";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { englishLocale } from "@/localization/config";
import iframeLineHtmlContent from "@/components/chart/config/Linechart.web";
import webviewLineHtmlContent from "@/components/chart/config/Linechart.android";
import { tabsType, ToggleChartComponentProps } from "@/types/chart.type";
import { UNIT_PLACEHOLDER } from "@/utils/dateformatter.utils";

const ToggleChartComponent = ({
	fetchChartData,
	yaxisunit = UNIT_PLACEHOLDER.PLACEHOLDER_EURO_PER_MEGAWATT_HOUR_UNIT,
	screenName = "loaddata",
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
		startDate: DateType;
		endDate: DateType;
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
			//	setTimeout(() => setLoading(false), 200);
			//break;

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
			updateEmptyApexChart({ webViewRef, iFrameRef, chartType: "line" });
			setIsChartEmpty(true);
			setTimeout(() => {
				setLoading(false);
			}, 500);
			return;
		}

		if (isTooltipEnabled) {
			updateApexChart({
				type: "options",
				webViewRef,
				iFrameRef,
				data: [],
				options: { markers: { size: 0 } },
			});
			setIsTooltipEnabled(false);
		}

		if (isChartZoomed) {
			webViewRef?.current?.injectJavaScript("window.resetZoom(); true;");
			setIschartZoomed(false);
			setLoading(true);
		}

		updateApexChart({
			type: "series",
			webViewRef,
			iFrameRef,
			data: filteredData,
			options: {},
		});

		if (iFrameRef?.current?.contentWindow?.isChartZoomed?.()) {
			iFrameRef.current.contentWindow.resetZoom();
		}

		setIsChartEmpty(false);
	};

	//its used to update charts culture and x axis formate
	const updateLocale = () => {
		updateLineApexChartLocale({
			locale,
			yaxisunit,
			activeTab,
			webViewRef,
			iFrameRef,
		});
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
					endDate: null,
					startDate: null,
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
				marginBottom: screenName !== "signals" ? insets.bottom : 0,
				marginTop: isLandscape ? insets.top : 0,
				marginRight: insets.right,
				marginLeft: insets.left,
			}}
		>
			{isLandscape ? (
				<FloatingActionMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					screenName={screenName}
					isLoading={isLoading}
				/>
			) : (
				<TabToggleButtons
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					screenName={screenName}
					isLoading={isLoading}
				/>
			)}
			{/* Chart  */}
			<View className="flex-1  border-gray-300 relative">
				{
					/** On Chart Animation End then show ChartGraphShimmer */
					showChartShimmer && <ChartGraphShimmer />
				}

				{
					/** On chart Tabs Change then Show Loader */
					isLoading && <ChartLoaderPNG />
				}

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
			{!isLandscape && screenName !== "signals" && (
				<React.Fragment>
					<PrimaryButton
						title={"Customize_View"}
						onPress={() => setModalVisible(!modalVisible)}
					/>
					<PickerModel
						screenName={screenName}
						//min max
						maxMinValues={maxMinValues}
						setMaxMinValues={setMaxMinValues}
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
