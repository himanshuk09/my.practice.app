import React, { useEffect } from "react";
import { FlatList } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { AccordionData } from "@/constants/constantData";
import { inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const LoadData = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const data = [
    { id: "1", data: AccordionData, title: "Gas" },
    { id: "2", data: AccordionData, title: "Power" },
  ];
  const renderItem = ({ item }: any) => (
    <AccordionFlatlist data={AccordionData} title={item?.title} />
  );
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
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
