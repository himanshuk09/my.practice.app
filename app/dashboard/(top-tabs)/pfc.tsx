import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { PFCGas, PFCStrom } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";

const PFC = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    setTimeout(() => dispatch(inActiveLoading()), 100);
  }, [isFocused]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      {PFCGas && (
        <FlatListBlock title="Gas" items={PFCGas} enableAutoScroll={false} />
      )}
      {PFCStrom && (
        <FlatListBlock title="Gas" items={PFCStrom} enableAutoScroll={false} />
      )}
    </SafeAreaView>
  );
};

export default PFC;
