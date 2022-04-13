import React from "react";
import { Image as RNImage, View } from "react-native";

export function Image(props) {
  return <RNImage {...props} source={{ uri: props.source }} />;
}
