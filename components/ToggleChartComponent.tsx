import { View, Text, Platform, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import TabToggleButtons from "@/components/TabToggleButtons";
import ChartComponent from "@/components/Chart/ChartComponent";
import { i18n } from "@/languageKeys/i18nConfig";
import { ChartLoaderPNG } from "@/components/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
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
};
const ToggleChartComponent = ({
    isSignaleScreen = false,
    bottonTitle = "Customize_View",
    showRangePicker,
    showPeriodOfTime,
    showValueRange,
    visibleTabs,
    fetchChartData,
}: ToggleChartComponentProps) => {
    const [isLoading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<tabsType>("Week");
    const [previousTab, setPreviousTab] = useState<tabsType>("Week");
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [isChartZoomed, setIschartZoomed] = useState(false);
    const locale = useSelector((state: any) => state.language.locale);
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch();
    const webViewRef = useRef<any>(null);
    const iFrameRef = useRef<any>(null);
    const isFirstRender = useRef(true);
    const [key, setKey] = useState<number>(Number(id));
    const reloadWebView = () => {
        setKey((prevKey: any) => prevKey + 1);
    };
    let title = i18n.t("Energy_Use");

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
        if (Platform.OS === "web") {
            setLoading(true);
        }
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
        if (
            Platform.OS === "web" ||
            activeTab === "Year" ||
            activeTab === "Year_3"
        ) {
            setTimeout(
                () => {
                    setLoading(false);
                },
                activeTab === "Year" || activeTab === "Year_3" ? 2000 : 5000
            );
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
    const updateLocale = () => {
        let localOption = {
            xaxis: {
                title: { text: i18n.t("datetime") },
            },
        };

        if (Platform.OS === "web") {
            const iframe = iFrameRef.current;
            if (iframe && iframe.contentWindow) {
                const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
                iframe.contentWindow.updateLocale?.(locale);
            }
            updateChart("options", localOption);
        } else {
            if (webViewRef?.current) {
                const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;

                webViewRef.current.injectJavaScript(updateLocaleScript);
            }
        }
    };
    const onMessage = async (event: any) => {
        //for file share or save
        const base64Data = event.nativeEvent.data;
        if (base64Data && base64Data.startsWith("data:image/png;base64,")) {
            // const fileName = `${FileSystem.documentDirectory}chart.png`;
            const fileName = `${
                FileSystem.documentDirectory
            }cockpi_chart_${new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/T/, "_")
                .replace(/\..+/, "")}.png`;

            try {
                // Save Base64 as a file
                await FileSystem.writeAsStringAsync(
                    fileName,
                    base64Data.split(",")[1],
                    {
                        encoding: FileSystem.EncodingType.Base64,
                    }
                );
                // Share or Save the file
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileName);
                }
            } catch (error) {
                // console.error("Error saving chart image:", error);
            }
        }

        //for loader on marker
        const message = JSON.parse(event.nativeEvent.data);
        if (message.action === "updateFormate") {
            setLoading(true);
        }
        if (message.action === "updateChartSeries") {
            setLoading(true);
        }
        if (message.action === "Chart updated") {
            setTimeout(
                () => {
                    setLoading(false);
                },
                activeTab === "Year" ||
                    activeTab === "Year_3" ||
                    previousTab === "Year" ||
                    previousTab === "Year_3"
                    ? 3000
                    : 1000
            );
        }
        if (message.action === "animationEnd") {
            setTimeout(() => {
                setLoading(false);
            }, 100);
        }
        // if (message.action === "updateLocale") {
        //     console.log(message?.action, message?.value);
        // }

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
            }, 1500);
        }
        if (message.action === "chartZoomed") {
            setIschartZoomed(message.isZoomed);
        }
        // console.log("message.action", message.action, message?.values);
    };

    // useEffect(() => {
    //     const getUpdatedData = () => {
    //         setLoading(true);
    //         if (activeTab === "Month") return filterByMonthYearUTC();
    //         if (activeTab === "Week") return filterCurrentWeekDataUTC();
    //         if (activeTab === "Day") return filterCurrentDayDataUTC();
    //         if (activeTab === "Quarter") return filterByCurrentQuarterUTC();
    //         if (activeTab === "Year") return cockpitChartData;
    //         if (activeTab === "Year_3") return cockpitChartData;
    //     };

    //     if (activeTab !== "") {
    //         let updatedData: any = getUpdatedData();
    //         console.log(updatedData?.length, "activeTab");
    //         updateChartData(updatedData);
    //         setPreviousTab(activeTab);
    //     }
    // }, [activeTab]);
    // useEffect(() => {
    //     setTimeout(() => {
    //         dispatch(inActiveLoading());
    //         updateLocale();
    //     }, 1000);
    // }, [locale]);
    const UpdateXaxisFormate = () => {
        if (webViewRef?.current) {
            const updateLocaleScript = `if (typeof updateFormate === 'function') {updateFormate('${activeTab}','${locale}');}`;
            webViewRef.current.injectJavaScript(updateLocaleScript);
        }
        const iframe = iFrameRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.updateFormate?.(activeTab, locale);
        }
    };
    const fetchData = async () => {
        if (fetchChartData) {
            try {
                if (Platform.OS === "web") {
                    setLoading(true);
                }
                const data = await fetchChartData(activeTab);
                UpdateXaxisFormate();
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
                    updateLocale();
                    isFirstRender.current = false;
                    dispatch(inActiveLoading());
                }, 500);
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
                />
            ) : (
                <FloatingActionMenu
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    visibleTabs={visibleTabs}
                />
            )}
            {/* Chart  */}
            <View className="flex-1  border-gray-300">
                {isLoading && <ChartLoaderPNG />}
                <ChartComponent
                    refereshkey={key}
                    webViewRef={webViewRef}
                    iFrameRef={iFrameRef}
                    onMessage={onMessage}
                    activeTab={activeTab}
                    webViewhtmlContent={WebviewLineHtmlContent}
                    iFramehtmlContent={iFrameLineHtmlcontent}
                    showToggle={false}
                    UpdateXaxisFormate={UpdateXaxisFormate}
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
