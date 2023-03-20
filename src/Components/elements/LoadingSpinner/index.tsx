import React from "react";
import { RotatingLines } from "react-loader-spinner";

export interface Props {
  strokeColor?: string;
  strokeWidth?: string;
  animationDuration?: string;
  width?: string;
  visible: boolean;
}
const LoadingSpinner: React.FC<Props> = ({ visible, ...props }) => {
  return (
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="1.2"
      width="16"
      visible={visible}
      {...props}
    />
  );
};

export default LoadingSpinner;
