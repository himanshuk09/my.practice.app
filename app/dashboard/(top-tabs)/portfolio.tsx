import React, { useState } from "react";

import { gasItems, powerItems } from "@/constants/constantData";

import FlatListBlock from "@/components/FlatListBlock";

const Portfolio: React.FC = () => {
  const [gasData, setGasData] = useState(gasItems);
  const [powerData, setPowerData] = useState(powerItems);

  return (
    <>
      {gasData && <FlatListBlock title="Gas" items={gasItems} />}
      {powerData && <FlatListBlock title="Power" items={powerItems} />}
    </>
  );
};

export default Portfolio;
