import React from "react";
import { NodeProps } from "@xyflow/react";
/* eslint-disable */

const CustomNode = ({ data, className, style }: NodeProps) => {
  return (
    <div
      className={`custom-node ${className}`}
      style={{ ...style, pointerEvents: "all" }}
    >
      {data.label}
    </div>
  );
};

export default CustomNode;
