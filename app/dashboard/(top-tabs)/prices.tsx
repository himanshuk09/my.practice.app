import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { memo, useEffect } from "react";
import { PricesItem } from "@/constants/constantData";
import { Href } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";

const Prices = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ListItem = memo(({ item }: any) => (
    <TouchableOpacity
      key={item.id}
      className="flex flex-row justify-between items-center w-auto p-3 px-2  rounded-sm font-medium my-1 shadow-slate-400  shadow-lg bg-white h-20"
      onPress={() => item.route && router.push(item.route as Href)}
    >
      <View className="flex flex-row items-center justify-start">
        <Text className="text-gray-700 mr-2">{item.title}</Text>
      </View>
      <View className="flex flex-row items-center justify-start">
        <Text className="font-sans text-gray-400 text-sm ">
          {item.unit} € / MWh
        </Text>
      </View>

      <FontAwesome5
        name={
          item.indicator === "up"
            ? "long-arrow-alt-up"
            : item.indicator === "down"
            ? "long-arrow-alt-down"
            : "long-arrow-alt-right"
        }
        size={24}
        color={
          item.indicator === "up"
            ? "#71D500"
            : item.indicator === "down"
            ? "red"
            : "gray"
        }
        style={{
          margin: 1,
          transform:
            item.indicator === "up" || item.indicator === "down"
              ? [{ rotate: "45deg" }]
              : [],
        }}
      />
    </TouchableOpacity>
  ));
  const renderItem = ({ item }: any) => <ListItem item={item} />;
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View className="h-auto">
        <View className="top-0 w-[100%] p-5 z-50 flex flex-row rounded-sm justify-between bg-[#e31837] ">
          <View className="flex flex-col justify-evenly w-[60%]">
            <Text className="flex justify-start font-semibold  items-center   text-xl  text-white">
              EEX Power Auction
            </Text>
            <Text className="flex justify-start font-semibold items-center  text-sm  text-white">
              24/07/5468
            </Text>
          </View>

          <View className="flex justify-center items-center w-[25%]">
            <Ionicons
              name="settings-sharp"
              size={36}
              color="white"
              onPress={() => router.push("/dashboard/setting/prices-setting")}
            />
          </View>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={PricesItem}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => index.toString()}
          scrollEnabled={true}
          className="bg-gray overflow-scroll mx-2"
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Prices;
