import React from "react";
import { Text, View } from "react-native";

export function List({ children, ...props }) {
  return <View {...props}>{children}</View>;
}
