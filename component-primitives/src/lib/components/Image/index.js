import React from "react";
import { Image as RNImage, View } from "react-native";

export function Image(props) {
  const { properties, style } = props;
  return <RNImage style={style} source={{ uri: properties.source }} />;
}
