import { View, Text, Platform, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import TabToggleButtons from "@/components/TabToggleButtons";
import ChartComponent from "@/components/Chart/ChartComponent";
import { i18n } from "@/languageKeys/i18nConfig";
import { cockpitChartData } from "@/constants/cockpitchart";
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

dayjs.extend(utc);
dayjs.extend(timezone);
type ChartUpdateType = "series" | "options" | "chart";
type tabsType = "Day" | "Week" | "Month" | "Quarter" | "Year" | "";
const ToggleChartComponent = ({
  isSignaleScreen = false,
  bottonTitle = "Customize_View",
  showRangePicker,
  showPeriodOfTime,
  showValueRange,
}: any) => {
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<tabsType>("Year");
  const [previousTab, setPreviousTab] = useState<tabsType>("Year");
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [isChartZoomed, setIschartZoomed] = useState(false);
  const locale = useSelector((state: any) => state.language.locale);
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const webViewRef = useRef<any>(null);
  const iFrameRef = useRef<any>(null);
  const [key, setKey] = useState<number>(Number(id));
  const reloadWebView = () => {
    setKey((prevKey: any) => prevKey + 1);
  };
  const isLandscape = useSelector(
    (state: RootState) => state.orientation.isLandscape
  );
  const updateChart = (type: ChartUpdateType, data?: any, options?: any) => {
    if (Platform.OS === "web") {
      const iframe = iFrameRef.current;
      if (iframe && iframe.contentWindow) {
        switch (type) {
          case "series":
            iframe.contentWindow.updateChartSeries?.(data);
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
          jsCommand = `updateChartSeries(${JSON.stringify(data)});`;
          break;
        case "options":
          jsCommand = `updateChartOptions(${JSON.stringify(data)});`;
          break;
        case "chart":
          jsCommand = `updateChart(${JSON.stringify(data)}, ${JSON.stringify(
            options || {}
          )});`;
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
      });
      updateChart("series", []);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
    if (Platform.OS === "web") {
      updateChart("series", filteredData);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
    if (
      activeTab === "Year" ||
      previousTab === "Year" ||
      activeTab === "Quarter" ||
      previousTab === "Quarter"
    ) {
      if (isChartZoomed) {
        webViewRef?.current.injectJavaScript("window.resetZoom(); true;");
        setIschartZoomed(false);
      }
      updateChart("options", {
        chart: {
          animations: {
            enabled: false,
          },
        },
      });
      updateChart("series", filteredData);
      updateChart("options", {
        chart: {
          animations: {
            enabled: true,
          },
        },
      });
    } else {
      if (isChartZoomed) {
        webViewRef?.current.injectJavaScript("window.resetZoom(); true;");
        setIschartZoomed(false);
      }
      updateChart("options", {
        chart: {
          animations: {
            enabled: true,
          },
        },
      });
      updateChart("series", filteredData);
    }
  };
  function filterCurrentDayDataUTC() {
    // Convert the targetDate to a Date object (UTC)
    const targetDateObj = new Date(1672542000000);

    // Set the start and end of the day (midnight to 11:59:59 PM) in UTC
    const startOfDay = new Date(
      Date.UTC(
        targetDateObj.getUTCFullYear(),
        targetDateObj.getUTCMonth(),
        targetDateObj.getUTCDate(),
        -1,
        0,
        0,
        0
      )
    ); // Start of day (UTC)
    const endOfDay = new Date(
      Date.UTC(
        targetDateObj.getUTCFullYear(),
        targetDateObj.getUTCMonth(),
        targetDateObj.getUTCDate(),
        22,
        59,
        59,
        999
      )
    );

    return cockpitChartData.filter((item: any) => {
      const datetime = new Date(item.x);
      return datetime >= startOfDay && datetime <= endOfDay;
    });
  }
  function filterCurrentWeekDataUTC() {
    const currentDateBerlin = new Date(1672660800000);
    const currentWeekStart = new Date(
      Date.UTC(
        currentDateBerlin.getUTCFullYear(),
        currentDateBerlin.getUTCMonth(),
        currentDateBerlin.getUTCDate() - currentDateBerlin.getUTCDay(), // Adjust for the start of the ISO week
        -1,
        0,
        0,
        0 // Set to the start of the day (00:00:00 UTC)
      )
    );
    const currentWeekEnd = new Date(
      Date.UTC(
        currentWeekStart.getUTCFullYear(),
        currentWeekStart.getUTCMonth(),
        currentWeekStart.getUTCDate() + 6,
        22,
        59,
        59,
        999
      )
    );
    return cockpitChartData.filter((item: any) => {
      const itemDate = new Date(item.x);
      return itemDate >= currentWeekStart && itemDate <= currentWeekEnd;
    });
  }
  function filterByMonthYearUTC() {
    let input = 1672542000000;
    const targetDate = new Date(input);

    const targetMonth = targetDate.getUTCMonth();
    const targetYear = targetDate.getUTCFullYear();

    const startOfMonth = new Date(
      Date.UTC(targetYear, targetMonth, 0, 0, 0, 0, 0)
    );
    const endOfMonth = new Date(
      Date.UTC(targetYear, targetMonth + 1, 0, 22, 59, 59, 999)
    );

    return cockpitChartData.filter((item: any) => {
      const datetime = new Date(item.x);
      return datetime >= startOfMonth && datetime <= endOfMonth;
    });
  }
  function filterByCurrentQuarterUTC() {
    let input = 1680566400000;
    const now = new Date(input);
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const startOfQuarter = new Date(
      Date.UTC(currentYear, quarterStartMonth, 1, 0, 0, 0, 0)
    );
    const endOfQuarter = new Date(
      Date.UTC(currentYear, quarterStartMonth + 3, 0, 23, 59, 59, 999)
    );

    return cockpitChartData.filter((item: any) => {
      const datetime = new Date(item.x);
      return datetime >= startOfQuarter && datetime <= endOfQuarter;
    });
  }
  function filterDataByDateRange(startDate: string, endDate: string) {
    // Convert startDate and endDate to UTC and adjust to the start and end of the day
    const start = dayjs.utc(startDate).startOf("day").toDate(); // Start of the day in UTC
    const end = dayjs.utc(endDate).endOf("day").toDate(); // End of the day in UTC

    // Filter data within the date range
    return cockpitChartData.filter((item: any) => {
      const itemDate = new Date(item.x); // Parse item's timestamp (assumed to be in UTC)
      return itemDate >= start && itemDate <= end;
    });
  }
  const handleRangeDataFilter = () => {
    let rangeFilterData = filterDataByDateRange(startDate, endDate);
    if (rangeFilterData.length === 0) {
      updateChart("options", {
        noData: { text: "Data not available" },
      });
      updateChart("series", []);
    } else {
      updateChart("series", rangeFilterData);
    }
    setActiveTab("");

    // const formatter = (value: any) => {
    //   const date = new Date(value);
    //   return date.toLocaleString(locale === "de" ? "de-DE" : "en-IN", {
    //     year: "numeric",
    //     month: "short",
    //     day: "2-digit",
    //     hour12: false,
    //     timeZone: berlineTimeZone,
    //   });
    // };
    // const xAxisFormater = {
    //   labels: {
    //     show: true,
    //     formatter: formatter,
    //   },
    // };
    // setLoading(true);
    // if (rangeFilterData?.length <= 0) {
    //   updateChart("options", {
    //     noData: { text: "Data not available" },
    //   });

    //   setTimeout(() => {
    //     updateChart("series", []);
    //   }, 500);
    // } else {
    //   updateChart("series", []);
    //   updateChart("options", {
    //     chart: {
    //       animations: {
    //         dynamicAnimation: { speed: 1000 },
    //       },
    //     },
    //     noData: { text: "" },
    //     xaxis: {
    //       ...xAxisFormater,
    //     },
    //   });
    //   setTimeout(() => {
    //     updateChart("series", rangeFilterData);
    //     setLoading(false);
    //   }, 500);
    // }
    // setLoading(false);
  };
  const updateLocale = () => {
    let localOption = {
      xaxis: {
        title: { text: i18n.t("datetime") },
      },
    };
    console.log(localOption.xaxis.title.text);

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
        console.log("updateLocaleScript");
        console.log("locale", locale);
        webViewRef.current.injectJavaScript(updateLocaleScript);
      }
    }
  };
  const onMessage = async (event: any) => {
    //for file share or save
    const base64Data = event.nativeEvent.data;
    if (base64Data && base64Data.startsWith("data:image/png;base64,")) {
      // const fileName = `${FileSystem.documentDirectory}chart.png`;
      const fileName = `${FileSystem.documentDirectory}cockpi_chart_${new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/T/, "_")
        .replace(/\..+/, "")}.png`;
      console.log("fileName", fileName);

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
    if (message.action === "updateChartSeries") {
      setLoading(true);
    } else if (message.action === "Chart updated") {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    if (message.action === "updateLocale") {
      console.log(message?.action, message?.value);
    }
    // Handle loader actions on tooltip toggle
    if (message.action === "startLoader" || message.action === "Zoom Start") {
      setLoading(true);
    } else if (message.action === "stopLoader" || message.action === "Zoomed") {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    if (message.action === "chartZoomed") {
      setIschartZoomed(message.isZoomed);
    }
    console.log("message.action", message.action, message?.values);
  };

  useEffect(() => {
    const getUpdatedData = () => {
      setLoading(true);
      if (activeTab === "Month") return filterByMonthYearUTC();
      if (activeTab === "Week") return filterCurrentWeekDataUTC();
      if (activeTab === "Day") return filterCurrentDayDataUTC();
      if (activeTab === "Quarter") return filterByCurrentQuarterUTC();
      if (activeTab === "Year") return cockpitChartData;
    };

    if (activeTab !== "") {
      let updatedData: any = getUpdatedData();
      console.log(updatedData?.length, "activeTab");
      updateChartData(updatedData);
      setPreviousTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(inActiveLoading());
      updateLocale();
      updateChartData(cockpitChartData);
    }, 1000);
  }, [locale]);
  return (
    <View className="flex-1  bg-white">
      {!isLandscape ? (
        <TabToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <FloatingActionMenu activeTab={activeTab} setActiveTab={setActiveTab} />
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
// const updateChartData1 = (filteredData: any) => {
//   updateChart("series", filteredData);
// setLoading(true);
// const xAxisRange =
//   filteredData?.length > 0
//     ? [filteredData[0]?.x, filteredData[filteredData?.length - 1].x]
//     : [0, 0];
// let previousDate: Date | null = null;
// const formatter: any = (value: any) => {
//   const date = new Date(value);
//   const isEdgeCase =
//     (value === xAxisRange[0] || value === xAxisRange[1]) &&
//     activeTab === "Day";
//   const isNewDate =
//     !previousDate ||
//     date.getFullYear() !== previousDate.getFullYear() ||
//     date.getMonth() !== previousDate.getMonth() ||
//     date.getDate() !== previousDate.getDate();

//   if (isEdgeCase || isNewDate) {
//     previousDate = date;
//     return new Intl.DateTimeFormat(localeFormatter, {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//       timeZone: berlineTimeZone,
//     }).format(date);
//   }
//   // Define date formatting options based on the active tab
//   const options: Intl.DateTimeFormatOptions =
//     activeTab === "Day"
//       ? {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//           timeZone: berlineTimeZone,
//         }
//       : activeTab === "Week" ||
//         activeTab === "Month" ||
//         activeTab === "Quarter" ||
//         (startDate && endDate)
//       ? {
//           year: "numeric",
//           month: "short",
//           day: "2-digit",
//           timeZone: berlineTimeZone,
//         }
//       : {
//           year: "numeric",
//           month: "short",
//           timeZone: berlineTimeZone,
//         };
//   return new Intl.DateTimeFormat(localeFormatter, options).format(date);
// };
// const xAxisFormater = {
//   labels: {
//     show: true,
//     formatter: formatter,
//   },
// };
// // Define chart options in a more concise way
// const updatedOptions = {
//   chart: {
//     animations: { dynamicAnimation: { speed: 1000 } },
//   },
//   noData: { text: "" },
//   xaxis: {
//     ...xAxisFormater,
//   },
// };
// const updatedInitialOptions = {
//   chart: {
//     animations: { dynamicAnimation: { speed: 100 } },
//   },
//   noData: { text: "" },
//   xaxis: {
//     ...xAxisFormater,
//   },
// };
// const updateEmptynoDataOptions = {
//   noData: { text: "" },
//   xaxis: {
//     ...xAxisFormater,
//   },
// };
// const updateNoDataOptions = {
//   noData: { text: "Data not available" },
//   xaxis: {
//     ...xAxisFormater,
//   },
// };
// const handleChartUpdate = (data: any, options: any) => {
//   updateChart("chart", data, options);
// };
// if (filteredData?.length <= 0) {
//   // Handle empty data
//   if (initialRender) {
//     handleChartUpdate([], updateEmptynoDataOptions);
//     setInitialRender(false);
//   } else {
//     handleChartUpdate([], updateNoDataOptions);
//   }
// } else {
//   // Handle non-empty data based on the selected filter
//   if (activeTab === "Year" && previousTab === "Year") {
//     // Initial state
//     console.log("empty selected", filteredData.length);
//     setTimeout(() => {
//       updateChart("series", filteredData);
//     });
//     updateChart("options", updatedInitialOptions);
//     // handleChartUpdate(filteredData, updatedInitialOptions);
//   } else if (
//     ["Month", "Week", "Day", "Quarter"].includes(activeTab) &&
//     previousTab === "Year"
//   ) {
//     // Transition from initial state
//     handleChartUpdate([], {
//       chart: { animations: { dynamicAnimation: { speed: 1000 } } },
//       xaxis: {
//         ...xAxisFormater,
//       },
//     });
//     updateChart("series", filteredData);
//   } else if (
//     ["Month", "Week", "Day", "Quarter"].includes(previousTab) &&
//     activeTab === "Year"
//   ) {
//     // Switching back to initial state
//     handleChartUpdate([], updatedInitialOptions);
//     updateChart("series", filteredData);
//   } else if (
//     ["Month", "Week", "Day", "Quarter"].includes(activeTab) &&
//     ["Month", "Week", "Day", "Quarter"].includes(previousTab)
//   ) {
//     // Switching between filters
//     console.log("here");
//     updateChart("options", updatedOptions);
//     updateChart("series", filteredData);
//   }
// }
//   setTimeout(() => {
//     setLoading(false);
//   }, 700);
// };
