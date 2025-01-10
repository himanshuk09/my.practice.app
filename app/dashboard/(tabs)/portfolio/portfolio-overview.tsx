import ChartComponent from "@/components/Chart/ChartComponent";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    FlatList,
    StatusBar,
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
import { i18n } from "@/languageKeys/i18nConfig";
import { portfolioCards } from "@/constants/constantData";
type ChartUpdateType = "series" | "options" | "chart";

const InfoItem = ({
    value,
    unit,
    width,
}: {
    value: string;
    unit: string;
    width?: string;
}) => (
    <View className={`flex-row justify-between ${width}   `}>
        <Text className="text-xs font-medium text-slate-400 ml-2 ">
            {value}
        </Text>
        <Text className="text-xs font-medium text-slate-400 items-end ">
            {unit}
        </Text>
    </View>
);
const Card = ({ title, data }: any) => {
    return (
        <View className="bg-cardBg rounded-lg p-3 my-1 shadow-md shadow-[eoeoeo]">
            <Text className="text-sm text-cardTextHeader font-medium mb-2">
                {title}
            </Text>
            <View className="space-y-2 flex-row justify-between">
                <View className="flex-col w-[45%]">
                    <View className="flex-row justify-between ">
                        <Text className="text-xs text-cardText">
                            {i18n.t("Direction")}:
                        </Text>
                        <View className="items-start justify-start w-[30%]">
                            <Text className="text-xs text-cardText">
                                {data.direction}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between ">
                        <Text className="text-xs text-cardText">
                            {i18n.t("Amount")}:
                        </Text>
                        <View className="items-start justify-start w-[30%]">
                            <Text className="text-xs  text-cardText">
                                {data.amount}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-xs text-cardText w-[70%]">
                            {i18n.t("Price")}:
                        </Text>
                        <View className="items-start justify-start w-[50%]">
                            <Text className="text-xs text-cardText">
                                {data.price}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex-col w-[45%]">
                    <View className="flex-row justify-between">
                        <Text className="text-xs text-cardText">
                            {i18n.t("Trader")}:
                        </Text>

                        <View className="items-start justify-start w-[50%]">
                            <Text className="text-xs text-cardText">
                                {data.trader}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between ">
                        <Text className="text-xs text-cardText">
                            {i18n.t("Date")}:
                        </Text>

                        <View className="items-start justify-start w-[50%]">
                            <Text className="text-xs text-cardText">
                                {data.date}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between ">
                        <Text className="text-xs text-cardText">
                            {i18n.t("State")}:
                        </Text>
                        <View className="items-start justify-start w-[50%]">
                            <Text className="text-xs text-cardText">
                                {data.state}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
const Transactions = ({ cards }: any) => {
    return (
        <View className="flex-1">
            <View className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5 shadow-2xl shadow-black ">
                <View className="justify-center items-start">
                    <Text className="text-xl font-semibold  text-mainCardHeaderText">
                        Strom 2024
                    </Text>
                    <Text className="text-md font-medium text-mainCardHeaderText">
                        Trade Transaction
                    </Text>
                </View>

                <View className="py-5 mr-5">
                    <FontAwesome5
                        name="file-download"
                        size={30}
                        color="#ef4444"
                        onPress={() => {}}
                    />
                </View>
            </View>
            {cards?.length === 0 ? (
                <View className="items-center justify-center h-full w-full">
                    <Text>Data Not Available</Text>
                </View>
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={cards}
                    renderItem={({ item, index }) => (
                        <Card key={index} title={item.title} data={item} />
                    )}
                    keyExtractor={(item: any, index) => index.toString()}
                    scrollEnabled={true}
                    className="bg-white overflow-scroll  p-2"
                    contentContainerStyle={{ paddingTop: 4 }}
                />
            )}
        </View>
    );
};
const Portfolio_OverView = () => {
    const locale = useSelector((state: any) => state.language.locale);
    const donutwebViewRef = useRef<any>(null);
    const donutIFrameRef = useRef<any>(null);
    const areaWebViewRef = useRef<any>(null);
    const areaIFrameRef = useRef<any>(null);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState(true);
    const [isChartVisible, setIsChartVisible] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [blockWidth, setBlockWidth] = useState(0);
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
                    jsCommand = `updateChart(${JSON.stringify(
                        data
                    )}, ${JSON.stringify(options || {})});`;
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
                    jsCommand = `updateChart(${JSON.stringify(
                        data
                    )}, ${JSON.stringify(options || {})});`;
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
            title: {
                text: "Strom 2025",
            },
        };
        updateDonutChart("series", filteredData);
        updateDonutChart("options", newOptions);
        updateLocale();
        updateAreaChart("series", updatedSeries);
        updateAreaChart("options", { title: { text: "Target 2025" } });
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
    //.....
    const toggleView = () => {
        Animated.timing(slideAnim, {
            toValue: isChartVisible ? 1 : 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
        setIsChartVisible(!isChartVisible);
    };

    const onLayout = (e: any) => {
        const { width } = e.nativeEvent.layout;
        setBlockWidth(width);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -blockWidth],
                                    }),
                                },
                            ],
                        },
                        { height: "100%" },
                    ]}
                    onLayout={onLayout}
                >
                    {isChartVisible && (
                        <View className="flex-1 bg-white">
                            <View className="flex flex-row justify-between h-[28%] ">
                                <ChartComponent
                                    webViewRef={donutwebViewRef}
                                    iFrameRef={donutIFrameRef}
                                    onMessage={onMessage}
                                    webViewhtmlContent={webviewDonutChartHtml}
                                    iFramehtmlContent={iFreameDonutChartHtml}
                                    showToggleOrientation={false}
                                    showToolbar={false}
                                    iFrameHeight="50%"
                                />

                                <View className="flex flex-col justify-start   items-start my-1">
                                    <View className="my-2">
                                        <Text className="text-sm text-[#e31837] font-semibold">
                                            Closed
                                        </Text>
                                        {closedData.map((item, index) => (
                                            <InfoItem
                                                key={index}
                                                value={item.value}
                                                unit={item.unit}
                                                width={
                                                    ["w-28", "w-34", "w-28"][
                                                        index
                                                    ]
                                                }
                                            />
                                        ))}
                                    </View>
                                    <View>
                                        <Text className="text-sm text-[#7f7f7f] font-semibold">
                                            Open
                                        </Text>
                                        {openData.map((item, index) => (
                                            <InfoItem
                                                key={index}
                                                value={item.value}
                                                unit={item.unit}
                                                width={
                                                    ["w-28", "w-34", "w-28"][
                                                        index
                                                    ]
                                                }
                                            />
                                        ))}
                                    </View>
                                </View>
                                <View className="mr-10 ml-7 mt-3">
                                    <FontAwesome5
                                        name="file-download"
                                        size={35}
                                        color="#ef4444"
                                        onPress={() => {}}
                                    />
                                </View>
                            </View>
                            <View className="h-1 bg-[#DEDEDE] my-1" />
                            <View className="h-[72%] pt-5">
                                <ChartComponent
                                    webViewRef={areaWebViewRef}
                                    iFrameRef={areaIFrameRef}
                                    onMessage={onMessage}
                                    webViewhtmlContent={webviewAreaHtmlcontent}
                                    iFramehtmlContent={iframeAreahtlcontent}
                                    showToggleOrientation={false}
                                    showToggle={false}
                                />
                            </View>
                        </View>
                    )}
                </Animated.View>

                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [blockWidth, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                    className={`${"h-full w-full absolute"} `}
                >
                    {!isChartVisible && <Transactions cards={portfolioCards} />}
                </Animated.View>
            </View>
            <TouchableOpacity
                className={`bg-[#e31836]  bottom-0  h-12 py-3 mx-5 rounded-sm my-2 ${
                    !isChartVisible &&
                    "absolute bg-[#e31836]  bottom-0 left-0 right-0  "
                }`}
                // onPress={updateArea}
                onPress={toggleView}
            >
                <Text className="text-white text-center text-base font-medium uppercase">
                    {i18n.t(isChartVisible ? "View_Deals" : "View_Portfolio")}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white">
                <View className="flex flex-row justify-between h-[28%] md:h-[27%]">
                    <ChartComponent
                        webViewRef={donutwebViewRef}
                        iFrameRef={donutIFrameRef}
                        onMessage={onMessage}
                        webViewhtmlContent={webviewDonutChartHtml}
                        iFramehtmlContent={iFreameDonutChartHtml}
                        showToggleOrientation={false}
                        showToolbar={false}
                    />

                    <View className="flex flex-col justify-start   items-start my-1">
                        <View className="my-2">
                            <Text className="text-sm text-[#e31837] font-semibold">
                                Closed
                            </Text>
                            {closedData.map((item, index) => (
                                <InfoItem
                                    key={index}
                                    value={item.value}
                                    unit={item.unit}
                                    width={["w-28", "w-34", "w-28"][index]}
                                />
                            ))}
                        </View>
                        <View>
                            <Text className="text-sm text-[#7f7f7f] font-semibold">
                                Open
                            </Text>
                            {openData.map((item, index) => (
                                <InfoItem
                                    key={index}
                                    value={item.value}
                                    unit={item.unit}
                                    width={["w-28", "w-34", "w-28"][index]}
                                />
                            ))}
                        </View>
                    </View>
                    <View className="mr-10 ml-7 mt-3">
                        <FontAwesome5
                            name="file-download"
                            size={35}
                            color="#ef4444"
                            onPress={() => {}}
                        />
                    </View>
                </View>
                <View className="h-1 bg-slate-300 my-1" />
                <View className="h-[63%] pt-5">
                    <ChartComponent
                        webViewRef={areaWebViewRef}
                        iFrameRef={areaIFrameRef}
                        onMessage={onMessage}
                        webViewhtmlContent={webviewAreaHtmlcontent}
                        iFramehtmlContent={iframeAreahtlcontent}
                        showToggleOrientation={false}
                        showToggle={false}
                    />
                </View>
                <TouchableOpacity
                    className="h-12  items-center bg-[#e31837] m-2 justify-center"
                    onPress={updateArea}
                >
                    <Text className="text-white font-bold">VIEW DETAILS</Text>
                </TouchableOpacity>
            </View>
            <View className="p-1"></View>
        </SafeAreaView>
    );
};

export default Portfolio_OverView;
