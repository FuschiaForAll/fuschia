import React from "react";
import { TextInput as RNTextInput } from "react-native";

export function TextInput(props) {
  const { properties, style } = props;
  return (
    <RNTextInput
      style={style}
      placeholder={properties.placeholder}
      value={properties.text?.value}
      onChange={(e) => properties.text?.onChange(e.target.value)}
    />
  );
}
