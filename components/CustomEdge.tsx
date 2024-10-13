import React from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";
/* eslint-disable */

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}: EdgeProps) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    // sourcePosition: "right",
    targetX,
    targetY,
    // targetPosition: "left",
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
    />
  );
};

export default CustomEdge;
