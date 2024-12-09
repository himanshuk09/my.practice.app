import React, { useState } from "react";

import { gasItems, powerItems } from "@/constants/constantData";

import FlatListBlock from "@/components/FlatListBlock";

const Portfolio: React.FC = () => {
  const [gasData, setGasData] = useState(gasItems);
  const [powerData, setPowerData] = useState(powerItems);

  return (
    <>
      {gasData && (
        <FlatListBlock
          title="Gas"
          items={gasItems}
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
