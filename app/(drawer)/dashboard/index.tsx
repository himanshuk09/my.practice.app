import {
  View,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  Button,
  PanResponder,
} from "react-native";
import "nativewind";
import MenuCard from "@/components/MenuCard";
import React, { useState, useEffect, useRef } from "react";
import { DashboardCardsEng } from "@/constants/constantData";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { closeDrawer, openDrawer, toggleDrawer } from "@/store/drawerSlice";

const Dashboard: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(DashboardCardsEng);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const startLoader = () => {
    dispatch(activeLoading());
  };

  useEffect(() => {
    setJsonData(DashboardCardsEng);
  }, DashboardCardsEng);

  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="justify-center items-center">
        {/* <Button title="Open Drawer" onPress={() => dispatch(openDrawer())} />
        <Button title="Close Drawer" onPress={() => dispatch(closeDrawer())} />
        <Button
          title="Toggle Drawer"
          onPress={() => dispatch(toggleDrawer())}
        /> */}
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
