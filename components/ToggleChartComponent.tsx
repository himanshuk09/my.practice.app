import { View, Text, Platform, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import TabToggleButtons from "@/components/TabToggleButtons";
import ChartComponent from "@/components/Chart/ChartComponent";
import { i18n } from "@/localization/localConfig";
import { ChartLoaderPNG } from "@/components/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import PickerModel from "@/components/PickerModel";
import { RootState } from "@/store/store";
import FloatingActionMenu from "./FloatingActionMenu";
import {
    WebviewLineHtmlContent,
    iFrameLineHtmlcontent,
} from "./Chart/charthtmlcontent";
import { filterDataByDateRange } from "./Chart/filterFunction";
import WebView from "react-native-webview";

dayjs.extend(utc);
dayjs.extend(timezone);
type ChartUpdateType = "series" | "options" | "chart";
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
}: ToggleChartComponentProps) => {
    const [isLoading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<tabsType>("Year");
    const [previousTab, setPreviousTab] = useState<tabsType>("Year");
    // const [startDate, setStartDate] = useState<any>();
    // const [endDate, setEndDate] = useState<any>();
    const [selectedStartDate, setSelectedStartDate] = useState<any>(dayjs());
    const [selectedEndDate, setSelectedEndDate] = useState<any>(
        dayjs().add(7, "day")
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [isChartZoomed, setIschartZoomed] = useState(false);
    const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);
    const [isChartEmpty, setIsChartEmpty] = useState(false);
    const locale = useSelector((state: any) => state.language.locale);
    const dispatch = useDispatch();
    const webViewRef = useRef<WebView | any>(null);
    const iFrameRef = useRef<HTMLIFrameElement | any>(null);
    const isFirstRender = useRef(true);
    let title = i18n.t("Energy_Use");
    const LoaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
    const updateChart = (type: ChartUpdateType, data?: any, options?: any) => {
        if (Platform.OS === "web") {
            const iframe = iFrameRef.current;
            if (iframe && iframe.contentWindow) {
                switch (type) {
                    case "series":
                        iframe.contentWindow.updateChartSeries?.(title, data);
                        break;
                    case "options":
                        iframe.contentWindow.updateChartOptions?.(data);
                        break;
                    case "chart":
                        iframe.contentWindow.updateChart?.(data, options);
                        break;
                    default:
                        console.error("Invalid chart update type");
                        return;
                }
            } else {
                console.error("Iframe contentWindow is not accessible.");
            }
        } else {
            let jsCommand = "";
            switch (type) {
                case "series":
                    jsCommand = `updateChartSeries(${JSON.stringify(
                        title
                    )},${JSON.stringify(data)});`;
                    break;
                case "options":
                    jsCommand = `updateChartOptions(${JSON.stringify(data)});`;
                    break;
                case "chart":
                    jsCommand = `updateChart(${JSON.stringify(
                        data
                    )}, ${JSON.stringify(options || {})});`;
                    break;
                default:
                    console.error("Invalid chart update type");
                    return;
            }

            (webViewRef.current as any)?.injectJavaScript(jsCommand);
        }
    };
    const updateChartData = (filteredData: any) => {
        if (filteredData?.length === 0) {
            updateChart("options", {
                chart: {},
                noData: { text: i18n.t("Data_not_available") },
                grid: {
                    show: false,
                },
                xaxis: {
                    tickAmount: 0,
                    labels: {
                        show: false,
                    },
                    title: {
                        text: "",
                        style: {
                            fontSize: "0",
                        },
                    },
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        show: false,
                    },
                    title: {
                        text: "",
                        style: {
                            fontSize: "0",
                        },
                    },
                },
                title: {
                    text: "",
                    align: "center",
                    style: {
                        fontSize: "0",
                    },
                },
            });
            updateChart("series", []);
            setIsChartEmpty(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
            return;
        }
        if (isTooltipEnabled) {
            updateChart("options", {
                markers: {
                    size: 0,
                },
            });
            setIsTooltipEnabled(false);
        }
        if (
            activeTab === "Year" ||
            previousTab === "Year" ||
            activeTab === "Quarter" ||
            previousTab === "Quarter" ||
            activeTab === "Year_3" ||
            previousTab === "Year_3"
        ) {
            if (isChartZoomed) {
                webViewRef?.current.injectJavaScript(
                    "window.resetZoom(); true;"
                );
                setIschartZoomed(false);
            }
            updateChart("options", {
                chart: {
                    animations: {
                        enabled: false,
                    },
                },
                grid: {
                    show: true,
                },
            });
            updateChart("series", filteredData);

            if (
                iFrameRef?.current &&
                iFrameRef?.current?.contentWindow &&
                iFrameRef?.current?.contentWindow?.isChartZoomed()
            ) {
                iFrameRef?.current?.contentWindow?.resetZoom();
            }
        } else {
            if (isChartZoomed) {
                webViewRef?.current.injectJavaScript(
                    "window.resetZoom(); true;"
                );
                setLoading(true);
                setIschartZoomed(false);
            }
            updateChart("options", {
                chart: {
                    animations: {
                        enabled: true,
                    },
                },
                grid: {
                    show: true,
                },
            });
            updateChart("series", filteredData);
            if (
                iFrameRef?.current &&
                iFrameRef?.current?.contentWindow &&
                iFrameRef?.current?.contentWindow.isChartZoomed()
            ) {
                iFrameRef?.current?.contentWindow?.resetZoom();
            }
        }
        setIsChartEmpty(false);
    };
    const updateLocale = () => {
        let localOption = {
            xaxis: {
                title: { text: i18n.t("datetime") },
            },
        };

        if (Platform.OS === "web") {
            const iframe = iFrameRef.current;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.updateLocale?.(locale);
                iframe.contentWindow.updateFormate?.(activeTab, locale);
            }
            updateChart("options", localOption);
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
            selectedStartDate,
            selectedEndDate
        );
        if (rangeFilterData?.length === 0) {
            updateChart("options", {
                noData: { text: "Data not available" },
            });
            updateChart("series", []);
        } else {
            updateChart("options", {
                chart: {
                    animations: {
                        enabled: false,
                    },
                },
                grid: {
                    show: true,
                },
            });
            updateChart("series", rangeFilterData);
        }
        setActiveTab("");
    };
    const onMessage = async (event: any) => {
        //for loader
        const message = JSON.parse(event.nativeEvent.data);
        if (
            message.action === "updateChartSeries" ||
            message.action === "updateChartOptions"
        ) {
            setLoading(true);
        }
        if (message.action === "Chart updated") {
            if (LoaderTimeoutRef.current) {
                clearTimeout(LoaderTimeoutRef.current);
            }
            // Assign new timeout without optional chaining
            LoaderTimeoutRef.current = setTimeout(() => {
                setLoading(false);
            }, 500);
        }

        // Handle loader actions on tooltip toggle
        if (message.action === "startLoader") {
            setLoading(true);
        } else if (message.action === "stopLoader") {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
        if (message.action === "chartZoomed") {
            setIschartZoomed(message.isZoomed);
        }
        if (message.action === "tooltip") {
            setIsTooltipEnabled(message?.values);
        }
        console.log("message.action", message.action, message?.values);
    };
    const fetchData = async () => {
        if (fetchChartData) {
            try {
                const data = await fetchChartData(activeTab);
                updateLocale();
                updateChartData(data);
                // filterData(activeTab);
                setPreviousTab(activeTab);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };
    const filterData = (activetab: any) => {
        if (Platform.OS === "web") {
            const iframe = iFrameRef.current;
            if (iframe && iframe.contentWindow) {
                switch (activetab) {
                    case "Day":
                        iframe.contentWindow.ZoomDayData();
                        break;
                    case "Week":
                        iframe.contentWindow.ZoomWeekData();
                        break;
                    case "Month":
                        iframe.contentWindow.ZoomMonthData();
                        break;
                    case "Quarter":
                        iframe.contentWindow.ZoomQuarterData();
                        break;
                    case "Year":
                        iframe.contentWindow.ResetData();
                        break;
                    default:
                        iframe.contentWindow.ResetData();
                        break;
                }
            } else {
                console.error("Iframe contentWindow is not accessible.");
            }
        } else {
            let jsCommand = "";
            switch (activetab) {
                case "Day":
                    jsCommand = `ZoomDayData()`;
                    break;
                case "Week":
                    jsCommand = `ZoomWeekData()`;
                    break;
                case "Month":
                    jsCommand = `ZoomMonthData()`;
                    break;
                case "Quarter":
                    jsCommand = `ZoomQuarterData()`;
                    break;
                case "Year":
                    jsCommand = `ResetData()`;
                    break;
                default:
                    jsCommand = `ResetData()`;
                    break;
            }

            (webViewRef.current as any)?.injectJavaScript(jsCommand);
        }
    };
    useEffect(() => {
        const executeAfterRender = async () => {
            if (isFirstRender.current) {
                setTimeout(() => {
                    // updateChartData(cockpitChartData);
                    fetchData();
                    isFirstRender.current = false;
                }, 1000);
                dispatch(inActiveLoading());
            } else {
                fetchData();
            }
        };
        executeAfterRender();
    }, [activeTab, fetchChartData, locale]);
    const ZoomData = () => {
        (webViewRef.current as any)?.injectJavaScript(`ZoomData()`);
    };
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
                    webViewhtmlContent={WebviewLineHtmlContent}
                    iFramehtmlContent={iFrameLineHtmlcontent}
                    showToggle={false}
                    setLoading={setLoading}
                    isTooltipEnabled={isTooltipEnabled}
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
                        showRangePicker={showRangePicker}
                        showPeriodOfTime={showPeriodOfTime}
                        showValueRange={showValueRange}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        timePicker={true}
                        selectedStartDate={selectedStartDate}
                        setSelectedStartDate={setSelectedStartDate}
                        selectedEndDate={selectedEndDate}
                        setSelectedEndDate={setSelectedEndDate}
                        handleRangeDataFilter={handleRangeDataFilter}
                    />
                </>
            )}
        </View>
    );
};

export default ToggleChartComponent;
