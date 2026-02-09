import React from "react";
import useThemeStore from "../../stores/useThemeStore";

const CustomConnectionLine = ({ fromX, fromY, toX, toY }) => {
  const theme = useThemeStore((state) => state.theme);
  const color = theme === "light" ? "black" : "white";

  return (
    <path
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke={color}
      strokeWidth={1.5}
      // className="animated"
      fill="none"
      markerEnd="url(#react-flow__arrowclosed)"
      d={`M${fromX},${fromY} L${toX},${toY}`}
    />
  );
};

export default CustomConnectionLine;
