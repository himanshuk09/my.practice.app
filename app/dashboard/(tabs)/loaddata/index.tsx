import React, { useEffect } from "react";
import { FlatList, StatusBar } from "react-native";
import AccordionFlatlist from "@/components/AccordionFlatlist";
import { AccordionData } from "@/constants/constantData";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadData = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const data = [
    { id: "1", data: AccordionData, title: "Gas" },
    { id: "2", data: AccordionData, title: "Power" },
  ];
  const startLoader = () => {
    dispatch(activeLoading());
  };
  const renderItem = ({ item }: any) => (
    <AccordionFlatlist
      data={AccordionData}
      title={item?.title}
      startLoader={startLoader}
    />
  );
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        animated
        showHideTransition={"slide"}
        networkActivityIndicatorVisible
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default LoadData;
