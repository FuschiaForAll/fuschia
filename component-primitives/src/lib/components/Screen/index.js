import React, { useEffect } from "react";
import { View } from "react-native";

export function Screen({ children, onLoad, ...props }) {
  // useEffect(() => {
  //   if (onLoad) {
  //     onLoad();
  //   }
  // }, []);
  return <View {...props}>{children}</View>;
}
