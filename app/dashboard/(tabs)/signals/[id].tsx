import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Easing,
    ScrollView,
    FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem, signalsCards } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import CustomSwitch from "@/components/CustomSwitch";
import { i18n } from "@/languageKeys/i18nConfig";
import { RootState } from "@/store/store";
import { StatusBar } from "react-native";

const Card = ({ title, data }: any) => {
    return (
        <View className="bg-[#ebebeb] rounded-lg p-3 my-1 shadow-md shadow-black">
            <Text className="text-sm text-gray-800 font-normal mb-2">
                {title}
            </Text>
            <View className="space-y-2 flex-row justify-between">
                <View className="flex-col w-[45%]">
                    <View className="flex-row justify-between">
                        <Text className=" text-sm text-gray-600">
                            {i18n.t("Low_Soft")}:
                        </Text>
                        <Text className="text-gray-500">{data.lowSoft}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">
                            {i18n.t("Low_Hard")}
                        </Text>
                        <Text className="text-gray-500">{data.lowHard}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">
                            {i18n.t("Negative")}:
                        </Text>
                        <Text className="text-gray-500">
                            {i18n.t(data.negative)}
                        </Text>
                    </View>
                </View>
                <View className="flex-col w-[45%]">
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">
                            {i18n.t("High_Soft")}:
                        </Text>
                        <Text className="text-gray-500">{data.highSoft}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">
                            {i18n.t("High_Hard")}:
                        </Text>
                        <Text className="text-gray-500">{data.highHard}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">
                            {i18n.t("Days")}:
                        </Text>
                        <Text className="text-gray-500">{data.days}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
const SignalSettings = ({ cards }: any) => {
    return cards?.length === 0 ? (
        <View className="items-center bg-gray-100 overflow-scroll  p-2 justify-center h-full w-full">
            <Text>Data Not Available</Text>
        </View>
    ) : (
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={cards}
            renderItem={({ item, index }) => (
                <Card key={index} title={item.title} data={item.data} />
            )}
            keyExtractor={(item: any, index) => index.toString()}
            scrollEnabled={true}
            className="bg-gray-100 overflow-scroll  p-2"
            contentContainerStyle={{ paddingTop: 4 }}
        />
    );
};

const PricesDetails = () => {
    const { id } = useLocalSearchParams();
    const [pricesDetail, setPricesDetails] = useState<any>();
    const [isEnabled, setIsEnabled] = useState(true);
    const [isChartVisible, setIsChartVisible] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [blockWidth, setBlockWidth] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const isLandscape = useSelector(
        (state: RootState) => state.orientation.isLandscape
    );
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

    useEffect(() => {
        console.log(typeof id);
        const filteredItem = PricesItem.filter(
            (item: any) => item.id === Number(id)
        );
        setPricesDetails(filteredItem[0]);
        console.log(filteredItem[0]);
    }, [id]);

    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    console.log("isChartVisible", isChartVisible);

    return (
        <SafeAreaView className="flex-1 ">
            <StatusBar
                barStyle="dark-content"
                backgroundColor={isLandscape ? "#ffffff" : "#C3C3C3"}
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <View className="flex-1  bg-transparent">
                {/* Header Section */}
                {!isLandscape && (
                    <View className="flex justify-between bg-white flex-row  m-1  h-20 px-3 pl-5 shadow-2xl shadow-black ">
                        <View className="justify-center items-center">
                            <Text className="text-xl font-medium text-mainCardHeaderText">
                                {pricesDetail?.title}
                            </Text>
                        </View>
                        <View className="flex-row justify-center items-center">
                            <Text className="  mr-2 text-md font-normal text-mainCardHeaderText ">
                                Notification
                            </Text>
                            <CustomSwitch
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                            />
                        </View>
                    </View>
                )}

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
                        className={`${
                            !isLandscape &&
                            "h-full w-full absolute justify-center items-center bg-white"
                        } `}
                    >
                        {isChartVisible && (
                            <ToggleChartComponent isSignaleScreen={true} />
                        )}
                    </Animated.View>

                    {!isLandscape && (
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
                        >
                            {!isChartVisible && (
                                <SignalSettings cards={signalsCards} />
                            )}
                        </Animated.View>
                    )}
                </View>
                {!isLandscape && (
                    <TouchableOpacity
                        className="bg-[#e31836] py-2 mx-5 rounded-sm my-2"
                        onPress={toggleView}
                    >
                        <Text className="text-white text-center text-base font-medium uppercase">
                            {i18n.t(
                                isChartVisible
                                    ? "View_Signal_Settings"
                                    : "View_Signal_Chart"
                            )}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default PricesDetails;
