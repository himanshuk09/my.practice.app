import React, { useEffect, useState } from "react";
import { gasItems, powerItems } from "@/constants/constantData";
import FlatListBlock from "@/components/FlatListBlock";
import axios from "axios";
const Portfolio: React.FC = () => {
  // const [gasData, setGasData] = useState(gasItems);
  // const [powerData, setPowerData] = useState(powerItems);
  const [gasData, setGasData] = useState([]);
  const [powerData, setPowerData] = useState(powerItems);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://api.jsonbin.io/v3/qs/6757d246ad19ca34f8d88816"
      );
      console.log(response);
      setGasData(response?.data?.record);
    };
    fetchData();
  }, []);
  return (
    <>
      {gasData && (
        <FlatListBlock
          title="Gas"
          items={gasData}
          enableAutoScroll={true}
          height={300}
        />
      )}
      {powerData && (
        <FlatListBlock
          title="Power"
          items={powerItems}
          enableAutoScroll={true}
          height={300}
        />
      )}
    </>
  );
};

export default Portfolio;
