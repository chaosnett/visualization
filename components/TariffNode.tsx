import React from "react";
import { NodeProps } from "@xyflow/react";

const TariffNode = ({ data, style }: NodeProps) => {
  return (
    <div
      className="tariff-node"
      style={{
        ...style,
        backgroundColor: "#FF6347", // Tomato color
        border: "1px solid black",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      {data.label}
    </div>
  );
};

export default TariffNode;
