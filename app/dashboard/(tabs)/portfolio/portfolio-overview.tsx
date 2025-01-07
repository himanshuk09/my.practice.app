import ChartComponent from "@/components/Chart/ChartComponent";

import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  iframeAreahtlcontent,
  iFreameDonutChartHtml,
  webviewAreaHtmlcontent,
  webviewDonutChartHtml,
} from "@/components/Chart/charthtmlcontent";
type ChartUpdateType = "series" | "options" | "chart";

const InfoItem = ({
  value,
  unit,
  width,
}: {
  value: string;
  unit: string;
  width: string;
}) => (
  <View className={`flex-row justify-between ${width}`}>
    <Text className="text-xs font-medium text-slate-400 ml-2">{value}</Text>
    <Text className="text-xs font-medium text-slate-400">{unit}</Text>
  </View>
);
const Portfolio_OverView = () => {
  const locale = useSelector((state: any) => state.language.locale);
  const donutwebViewRef = useRef<any>(null);
  const donutIFrameRef = useRef<any>(null);
  const areaWebViewRef = useRef<any>(null);
  const areaIFrameRef = useRef<any>(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

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
        console.error("Error saving chart image:", error);
      }
    }

    const message = JSON.parse(event.nativeEvent.data);
    console.log("message.action", message.action, message?.values);
  };
  const updateAreaChart = (
    type: ChartUpdateType,
    data?: any,
    options?: any
  ) => {
    if (Platform.OS === "web") {
      const iframe = areaIFrameRef.current;
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
          console.log("series");
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

      (areaWebViewRef.current as any)?.injectJavaScript(jsCommand);
    }
  };
  const updateDonutChart = (
    type: ChartUpdateType,
    data?: any,
    options?: any
  ) => {
    if (Platform.OS === "web") {
      const iframe = donutIFrameRef.current;
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
          console.log("series");
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

      (donutwebViewRef?.current as any)?.injectJavaScript(jsCommand);
    }
  };
  let updatedSeries = [
    {
      name: "Forward",
      data: [25, 40, 20, 15, 10, 30, 10, 25, 15, 30, 20, 35],
    },
    {
      name: "IbISwing",
      data: [25, 15, 20, 25, 15, 15, 20, 10, 35, 25, 30, 20],
    },
    {
      name: "IbIspot",
      data: [35, 20, 10, 15, 30, 25, 20, 10, 30, 25, 35, 20],
    },
    {
      name: "Closed",
      data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    },
  ];
  const updateLocale = () => {
    if (Platform.OS === "web") {
      const iframe = areaIFrameRef.current;
      if (iframe && iframe.contentWindow) {
        const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
        iframe.contentWindow.updateLocale?.(locale);
      }
    } else {
      if (areaWebViewRef?.current) {
        const updateLocaleScript = `if (typeof updateLocale === 'function') {updateLocale('${locale}');}`;
        console.log("updateLocaleScript");
        console.log("locale", locale);
        areaWebViewRef.current.injectJavaScript(updateLocaleScript);
      }
    }
  };
  const updateArea = () => {
    const filteredData = [45, 45];
    const newOptions = {
      colors: ["#4CAF50", "#FFC107"],
    };
    updateDonutChart("series", filteredData);
    updateDonutChart("options", newOptions);
    updateLocale();
    updateAreaChart("series", updatedSeries);
  };

  const closedData = [
    { value: "770,005", unit: "$" },
    { value: "17,588", unit: "MWh" },
    { value: "43.83", unit: "$/MWh" },
  ];
  const openData = [
    { value: "2,829,207", unit: "$" },
    { value: "57,288", unit: "MWh" },
    { value: "49.39", unit: "$/MWh" },
  ];

  useEffect(() => {
    setTimeout(() => {
      dispatch(inActiveLoading());
    }, 100);
    setTimeout(() => {
      updateLocale();
    }, 2000);
  }, [isFocused]);
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View className="flex-1 bg-white p-1">
        <View className="flex flex-row justify-between h-[30%] md:h-[27%] mb-2">
          <View className="w-[45%] ">
            <ChartComponent
              webViewRef={donutwebViewRef}
              iFrameRef={donutIFrameRef}
              onMessage={onMessage}
              webViewhtmlContent={webviewDonutChartHtml}
              iFramehtmlContent={iFreameDonutChartHtml}
              showToggleOrientation={false}
              showToolbar={false}
            />
          </View>
          <View className="flex flex-col justify-start items-start my-1">
            <View className="mb-2">
              <Text className="text-sm text-[#e31837] font-semibold">
                Closed
              </Text>
              {closedData.map((item, index) => (
                <InfoItem
                  key={index}
                  value={item.value}
                  unit={item.unit}
                  width={["w-24", "w-32", "w-36"][index]}
                />
              ))}
            </View>
            <View>
              <Text className="text-sm text-[#7f7f7f] font-semibold">Open</Text>
              {openData.map((item, index) => (
                <InfoItem
                  key={index}
                  value={item.value}
                  unit={item.unit}
                  width={["w-24", "w-32", "w-36"][index]}
                />
              ))}
            </View>
          </View>
          <View className="mr-10 ml-5 mt-3">
            <FontAwesome5
              name="file-download"
              size={35}
              color="#ef4444"
              onPress={() => {}}
            />
          </View>
        </View>
        <View className="h-1 bg-slate-300 my-1" />
        <View className="h-[100%] w-[100%]">
          <ChartComponent
            webViewRef={areaWebViewRef}
            iFrameRef={areaIFrameRef}
            onMessage={onMessage}
            webViewhtmlContent={webviewAreaHtmlcontent}
            iFramehtmlContent={iframeAreahtlcontent}
            showToggleOrientation={false}
            showToggle={true}
          />
        </View>
      </View>
      <View className="p-1">
        <TouchableOpacity
          className="h-12  items-center bg-[#e31837] m-2 justify-center"
          onPress={updateArea}
        >
          <Text className="text-white font-bold">VIEW DETAILS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Portfolio_OverView;
