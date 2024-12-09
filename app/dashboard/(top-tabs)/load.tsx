import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { AccordionData } from "@/constants/constantData";

const LoadData = () => {
  const data = [
    { id: "1", data: AccordionData, title: "Gas" },
    { id: "2", data: AccordionData, title: "Power" },
  ];

  const renderItem = ({ item }: any) => (
    <AccordionFlatlist data={AccordionData} title={item?.title} />
  );

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default LoadData;
