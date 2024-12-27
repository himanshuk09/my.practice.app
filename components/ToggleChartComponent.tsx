import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import TabToggleButtons from "@/components/TabToggleButtons";
import ChartComponent from "@/components/Chart/ChartComponent";
import { englishIN, germany, i18n } from "@/languageKeys/i18nConfig";
import { cockpitChartData } from "@/constants/cockpitchart";
import { ChartLoaderPNG } from "@/components/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import PickerModel from "@/components/PickerModel";
import { RootState } from "@/store/store";
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
            iframe.contentWindow.updateChartSeries?.([{ data: data }]);
            break;
          case "options":
            iframe.contentWindow.updateChartOptions?.(data);
            break;
          case "chart":
            iframe.contentWindow.updateChart?.([{ data: data }], options);
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
          console.log("series", data?.length);
          jsCommand = `updateChartSeries(${JSON.stringify(data)});`;
          break;
        case "options":
          console.log("options");
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
  const updateChartData1 = (filteredData: any) => {
    console.log("filteredData", filteredData?.length);
    updateChart("series", filteredData);
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
    //   noData: { text: "no data" },
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
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const updateChartData = (filteredData: any) => {
    console.log("filteredData", filteredData?.length);
    // updateChart("series", filteredData);
    setLoading(true);

    // Define chart options in a more concise way
    const updatedOptions = {
      chart: {
        animations: { dynamicAnimation: { speed: 1000 } },
      },
      noData: { text: "" },
    };
    const updatedInitialOptions = {
      chart: {
        animations: { dynamicAnimation: { speed: 100 } },
      },
      noData: { text: "" },
    };
    const updateEmptynoDataOptions = {
      noData: { text: "" },
    };
    const updateNoDataOptions = {
      noData: { text: "no data" },
    };
    const handleChartUpdate = (data: any, options: any) => {
      updateChart("chart", data, options);
    };
    if (filteredData?.length <= 0) {
      // Handle empty data
      if (initialRender) {
        handleChartUpdate([], updateEmptynoDataOptions);
        setInitialRender(false);
      } else {
        handleChartUpdate([], updateNoDataOptions);
      }
    } else {
      // Handle non-empty data based on the selected filter
      if (activeTab === "Year" && previousTab === "Year") {
        // Initial state
        console.log("empty selected", filteredData.length);
        setTimeout(() => {
          updateChart("series", filteredData);
        });
        updateChart("options", updatedInitialOptions);
        // handleChartUpdate(filteredData, updatedInitialOptions);
      } else if (
        ["Month", "Week", "Day", "Quarter"].includes(activeTab) &&
        previousTab === "Year"
      ) {
        // Transition from initial state
        handleChartUpdate([], {
          chart: { animations: { dynamicAnimation: { speed: 1000 } } },
        });
        updateChart("series", filteredData);
      } else if (
        ["Month", "Week", "Day", "Quarter"].includes(previousTab) &&
        activeTab === "Year"
      ) {
        // Switching back to initial state
        handleChartUpdate([], updatedInitialOptions);
        updateChart("series", filteredData);
      } else if (
        ["Month", "Week", "Day", "Quarter"].includes(activeTab) &&
        ["Month", "Week", "Day", "Quarter"].includes(previousTab)
      ) {
        // Switching between filters
        console.log("here");
        updateChart("options", updatedOptions);
        updateChart("series", filteredData);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
    console.log("callled");
    let rangeFilterData = filterDataByDateRange(startDate, endDate);
    console.log("rangeFilterData", rangeFilterData.length);
    if (rangeFilterData.length === 0) {
      updateChart("options", {
        noData: { text: "No data" },
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
    //     noData: { text: "no data" },
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
    if (Platform.OS === "web") {
      const iframe = iFrameRef.current;
      if (iframe && iframe.contentWindow) {
        const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
        iframe.contentWindow.updateLocale?.(locale);
      }
      updateChart("options", localOption);
    } else {
      if (webViewRef.current) {
        const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
        webViewRef.current.injectJavaScript(updateLocaleScript);
        updateChart("options", localOption);
      }
    }
  };
  const onMessage = async (event: any) => {
    //for file share or save
    const base64Data = event.nativeEvent.data;
    if (base64Data && base64Data.startsWith("data:image/png;base64,")) {
      const fileName = `${FileSystem.documentDirectory}chart.png`;
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
        console.error("Error saving chart image:", error);
      }
    }
    //for loader on marker
    const webViewMessage = JSON.parse(event.nativeEvent.data);
    if (webViewMessage.action === "updateChartSeriesss") {
      console.log("update");
    }
    // Handle loader actions on tooltip toggle
    if (webViewMessage.action === "startLoader") {
      setLoading(true);
    } else if (webViewMessage.action === "stopLoader") {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };
  //convert json to CSV
  const splitTimestamp = (timestamp: number) => {
    const date = new Date(timestamp); // Convert timestamp to Date object
    const formattedDate = date.toISOString().split("T")[0]; // Extract UTC date (YYYY-MM-DD)
    const formattedTime = date.toISOString().split("T")[1].slice(0, 8);
    [0]; // Extract UTC time (HH:mm:ss)
    return { formattedDate, formattedTime };
  };
  // Function to save CSV to a file
  const saveCSVToFile = async (jsonData: any[]) => {
    const headers = ["Date", "Time", "[kwh]"];
    const rows = jsonData.map((item) => {
      const { formattedDate, formattedTime } = splitTimestamp(item.x); // Split timestamp
      return [formattedDate, formattedTime, item.y].join(","); // Combine into CSV row
    });
    // Combine headers and rows to form the final CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");
    const fileName = `${FileSystem.documentDirectory}cockpit.csv`;
    try {
      // Write CSV content to file
      await FileSystem.writeAsStringAsync(fileName, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log(`CSV file saved at: ${fileName}`);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileName);
      }
    } catch (error) {
      console.error("Error saving CSV file:", error);
    }
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
    console.log("activeTab cALLED");
    if (activeTab !== "") {
      let updatedData: any = getUpdatedData();
      console.log(updatedData?.length);
      updateChartData(updatedData);
      setPreviousTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    reloadWebView();
    updateLocale();
    console.log("updateLocale reloadWebView cALLED");
    setTimeout(() => {
      dispatch(inActiveLoading());
    }, 100);
    setTimeout(() => {
      console.log("updateChartData(cockpitChartData);");
      setActiveTab("Year");
      updateChartData(cockpitChartData);
    }, 500);
  }, [isFocused]);
  return (
    <View className="flex-1  bg-white">
      {/* Toggle Buttons */}
      {!isLandscape && (
        <TabToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Chart  */}
      <View className="flex-1  border-gray-300">
        {isLoading && <ChartLoaderPNG />}
        <ChartComponent
          refereshkey={key}
          webViewRef={webViewRef}
          iFrameRef={iFrameRef}
          onMessage={onMessage}
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
