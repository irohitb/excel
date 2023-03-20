import React from "react";
import Lottie from "react-lottie-player";

interface Props {
  lotti: any;
  width: any;
  height: any;
}
export default function LottieAnimation({ lotti, width, height }: Props) {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    play: true,
    animationData: lotti,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    style: {
      width,
      height,
    },
  };

  return (
    <div>
      <Lottie {...defaultOptions} />
    </div>
  );
}
