import React, { useEffect, useState } from "react";
import { gasItems, powerItems } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import axios from "axios";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
const Portfolio: React.FC = () => {
  const [gasData, setGasData] = useState<any>([]);
  const [powerData, setPowerData] = useState<any>([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.jsonbin.io/v3/qs/6757ea6bacd3cb34a8b7110d"
        );
        console.log(response);
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
  }, []);
  useEffect(() => {
    dispatch(inActiveLoading());
  }, [isFocused]);
  return (
    <>
      <FlatListBlock
        title="Gas"
        items={gasData}
        enableAutoScroll={true}
        height={300}
      />
      <FlatListBlock
        title="Power"
        items={powerData}
        enableAutoScroll={true}
        height={300}
      />
    </>
  );
};

export default Portfolio;
