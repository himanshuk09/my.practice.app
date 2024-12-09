import {
  View,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import "nativewind";
import MenuCard from "@/components/MenuCard";

import React, { useState, useEffect } from "react";

import { DashboardCardsEng } from "@/constants/constantData";
import { usePathname, useRouter } from "expo-router";

import { activeLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";

const Dashboard: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(DashboardCardsEng);
  const [shouldExitApp, setShouldExitApp] = useState(false);
  const [isLoading, SetLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const startLoader = () => {
    dispatch(activeLoading());
  };
  useEffect(() => {
    setJsonData(DashboardCardsEng);
  }, DashboardCardsEng);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
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
