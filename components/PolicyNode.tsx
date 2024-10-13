import React from "react";
import { NodeProps } from "@xyflow/react";

const PolicyNode = ({ data, style }: NodeProps) => {
  return (
    <div
      className="policy-node"
      style={{
        ...style,
        backgroundColor: "#87CEEB", // Sky blue
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

export default PolicyNode;
