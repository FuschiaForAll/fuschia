import React from "react";
import { Button as RNButton } from "react-native";

export function Button(props) {
  console.log(props);
  debugger;
  return <RNButton {...props} />;
}
