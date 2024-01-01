import React from "react";
import Svg, { Path, G, ClipPath, Rect } from "react-native-svg";

const CheckedIcon = (props) => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect y="0.5" width="12" height="12" rx="2" fill="#185BF0" />
    <Path d="M3 6L5.5 8L9.5 4" stroke="white" />
  </Svg>
);

export default CheckedIcon;
