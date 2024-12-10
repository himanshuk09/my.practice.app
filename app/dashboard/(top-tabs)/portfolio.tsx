import React, { useEffect, useState } from "react";
import { gasItems, powerItems } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
const Portfolio: React.FC = () => {
  const [gasData, setGasData] = useState<any>([]);
  const [powerData, setPowerData] = useState<any>([]);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const isLoading = useSelector((state: any) => state?.navigation?.loading);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.jsonbin.io/v3/qs/6757ea6bacd3cb34a8b7110d"
        );
        console.log(response);

        setGasData(gasItems);
        setPowerData(powerItems);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("finally");
      }
    };
    fetchData();
  }, []);
  if (loader) {
    return <Loader />;
  }
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
