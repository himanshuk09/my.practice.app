import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PricesItem } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ToggleChartComponent from "@/components/ToggleChartComponent";
import CustomSwitch from "@/components/CustomSwitch";
import { i18n } from "@/languageKeys/i18nConfig";
const SignalSettings = ({ cards }: any) => {
  return (
    <ScrollView className="p-4 w-full h-full bg-white">
      {cards.map((card: any, index: any) => (
        <Card key={index} title={card.title} data={card.data} />
      ))}
    </ScrollView>
  );
};
const Card = ({ title, data }: any) => {
  return (
    <View className="bg-[#ebebeb] rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-md font-medium mb-2">{title}</Text>
      <View className="space-y-2 flex-row justify-between">
        <View className="flex-col w-[45%]">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Low Soft:</Text>
            <Text className="font-bold">{data.lowSoft}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Low Hard:</Text>
            <Text className="font-bold">{data.lowHard}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Negative:</Text>
            <Text className="font-bold">{data.negative}</Text>
          </View>
        </View>
        <View className="flex-col w-[45%]">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">High Soft:</Text>
            <Text className="font-bold">{data.highSoft}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">High Hard:</Text>
            <Text className="font-bold">{data.highHard}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Days:</Text>
            <Text className="font-bold">{data.days}</Text>
          </View>
        </View>
      </View>
    </View>
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
  const cards: any = [
    {
      title: "BB EEX HGas Cal Base + 1",
      data: {
        lowSoft: 10,
        lowHard: 5,
        negative: "No",
        highSoft: 20,
        highHard: 30,
        days: 20,
      },
    },
    {
      title: "RSI EEX HGas Cal Base + 1",
      data: {
        lowSoft: 20,
        lowHard: 10,
        negative: "No",
        highSoft: 80,
        highHard: 90,
        days: 10,
      },
    },
  ];
  return (
    <SafeAreaView className="flex-1 ">
      <StatusBar />

      <View className="flex-1  bg-white">
        {/* Header Section */}
        <View className="flex justify-between bg-white flex-row  m-1  h-20 px-4 shadow-2xl shadow-black ">
          <View className="justify-center items-center">
            <Text className="text-xl font-medium text-[#b5b5b5]">
              {pricesDetail?.title}
            </Text>
          </View>
          <View className="flex-row justify-center items-center">
            <Text className="  mr-2 text-md font-medium text-[#b5b5b5]">
              Notification
            </Text>
            <CustomSwitch isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
          </View>
        </View>

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
            ]}
            onLayout={onLayout}
            className="h-full absolute justify-center items-center bg-white"
          >
            {isChartVisible && <ToggleChartComponent isSignaleScreen={true} />}
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
          >
            {!isChartVisible && <SignalSettings cards={cards} />}
          </Animated.View>
        </View>

        <TouchableOpacity
          className="bg-[#e31836] py-2 mx-5 rounded-sm my-2"
          onPress={toggleView}
        >
          <Text className="text-white text-center text-base font-medium uppercase">
            {i18n.t(
              isChartVisible ? "View_Signal_Settings" : "View_Signal_Chart"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PricesDetails;
