import React from "react";
import { NodeProps } from "@xyflow/react";

const IndustryNode = ({ data, style }: NodeProps) => {
  return (
    <div
      className="industry-node"
      style={{
        ...style,
        backgroundColor: "#FFD700", // Gold color
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

export default IndustryNode;
