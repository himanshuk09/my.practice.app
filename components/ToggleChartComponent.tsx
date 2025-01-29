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
    const [activeTab, setActiveTab] = useState<tabsType>("Week");
    const [previousTab, setPreviousTab] = useState<tabsType>("Week");
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [isChartZoomed, setIschartZoomed] = useState(false);
    const locale = useSelector((state: any) => state.language.locale);
    const dispatch = useDispatch();
    const webViewRef = useRef<any>(null);
    const iFrameRef = useRef<any>(null);
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
                noData: { text: "Data not available" },
                grid: {
                    show: false,
                },
            });
            updateChart("series", []);
            setTimeout(() => {
                setLoading(false);
            }, 500);
            return;
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
        setLoading(false);
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
        let rangeFilterData = filterDataByDateRange(startDate, endDate);
        if (rangeFilterData?.length === 0) {
            updateChart("options", {
                noData: { text: "Data not available" },
            });
            updateChart("series", []);
        } else {
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
            }, 1000);
        }

        // Handle loader actions on tooltip toggle
        if (
            message.action === "startLoader" ||
            ((activeTab === "Year" || activeTab === "Year_3") &&
                message.action === "Zoom Start")
        ) {
            setLoading(true);
        } else if (
            message.action === "stopLoader" ||
            ((activeTab === "Year" || activeTab === "Year_3") &&
                message.action === "Zoomed")
        ) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
        if (message.action === "chartZoomed") {
            setIschartZoomed(message.isZoomed);
        }
        // console.log("message.action", message.action, message?.values);
    };
    const fetchData = async () => {
        if (fetchChartData) {
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
                    // updateLocale();
                    isFirstRender.current = false;
                }, 500);
                dispatch(inActiveLoading());
            } else {
                fetchData();
            }
        };
        executeAfterRender();
    }, [activeTab, fetchChartData, locale]);

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
                    webViewRef={webViewRef}
                    iFrameRef={iFrameRef}
                    onMessage={onMessage}
                    activeTab={activeTab}
                    webViewhtmlContent={WebviewLineHtmlContent}
                    iFramehtmlContent={iFrameLineHtmlcontent}
                    showToggle={false}
                    setLoading={setLoading}
                />
            </View>

            {/* Bottom Button */}
            {!isLandscape && !isSignaleScreen && (
                <>
                    <TouchableOpacity
                        className="bg-[#e31836] py-2 mx-5 rounded-sm my-2"
                        onPress={() => setModalVisible(!modalVisible)}
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
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        handleRangeDataFilter={handleRangeDataFilter}
                    />
                </>
            )}
        </View>
    );
};

export default ToggleChartComponent;
