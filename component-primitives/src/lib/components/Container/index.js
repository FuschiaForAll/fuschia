import React from "react";
import { View } from "react-native";

export function Container({ children, ...props }) {
  return <View {...props}>{children}</View>;
}
