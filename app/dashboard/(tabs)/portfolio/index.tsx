import React, { useEffect, useState } from "react";
import { gasItems, powerItems } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";

import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
import { Platform } from "react-native";
const Portfolio: React.FC = () => {
  const [gasData, setGasData] = useState<any>([]);
  const [powerData, setPowerData] = useState<any>([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGasData(gasItems);
        setPowerData(powerItems);
        dispatch(inActiveLoading());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("finally");
      }
    };
    fetchData();
  }, [isFocused]);

  return (
    <>
      <FlatListBlock
        title="Gas"
        items={gasData}
        height={Platform.OS === "web" ? 380 : "49%"}
      />
      <FlatListBlock
        title="Power"
        items={powerData}
        height={Platform.OS === "web" ? 380 : "49%"}
      />
    </>
  );
};

export default Portfolio;
