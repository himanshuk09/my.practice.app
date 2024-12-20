import React, { useEffect } from "react";
import { View, SafeAreaView, StatusBar, FlatList } from "react-native";
import FlatListBlock from "@/components/FlatListBlock";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";

const Signals = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const combinedData = [
    { type: "header", title: "Gas", data: SignalsGas },
    { type: "header", title: "Strom", data: SignalsStrom },
  ];
  const renderItem = ({ item }: any) => {
    if (item.type === "header") {
      return (
        <View style={{ marginBottom: 20 }}>
          <FlatListBlock
            title={item.title}
            items={item.data}
            enableAutoScroll={false}
          />
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <FlatList
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Signals;
