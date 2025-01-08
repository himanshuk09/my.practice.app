import {
  View,
  FlatList,
  SafeAreaView,
  Platform,
  Button,
  PanResponder,
  StatusBar,
} from "react-native";
import "nativewind";
import MenuCard from "@/components/MenuCard";
import React, { useState, useEffect, useRef } from "react";
import { DashboardCardsEng } from "@/constants/constantData";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Href } from "expo-router";
interface MenuItem {
  id: number;
  title: string;
  icon: string;
  notificationCount: number;
  route: any;
}
const Dashboard: React.FC = () => {
  const [jsonData, setJsonData] = useState<MenuItem[]>(DashboardCardsEng);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const startLoader = () => {
    dispatch(activeLoading());
  };
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  console.log("baseUrl", baseUrl);

  useEffect(() => {
    setJsonData(DashboardCardsEng);
  }, DashboardCardsEng);

  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        animated
        showHideTransition={"slide"}
        networkActivityIndicatorVisible
      />
      <View className="justify-center items-center">
        <FlatList
          data={jsonData}
          keyExtractor={(item) => item?.id?.toString()}
          numColumns={2}
          renderItem={({ item, index }) => (
            <MenuCard item={item} index={index} startLoader={startLoader} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};
export default Dashboard;
