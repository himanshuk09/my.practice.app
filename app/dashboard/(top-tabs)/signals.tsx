import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import FlatListBlock from "@/components/FlatListBlock";
import { SignalsGas, SignalsStrom } from "@/constants/constantData";

const Signals = () => {
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
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Gas Signals */}
        {SignalsGas && (
          <View className="mb-4">
            <FlatListBlock
              title="Gas"
              items={SignalsGas}
              enableAutoScroll={false}
            />
          </View>
        )}

        {/* Strom Signals */}
        {SignalsStrom && (
          <View className="mb-4">
            <FlatListBlock
              title="Strom"
              items={SignalsStrom}
              enableAutoScroll={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signals;
