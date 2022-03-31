import React from "react";
import { TextInput as RNTextInput } from "react-native";

export function TextInput(props) {
  return (
    <RNTextInput
      {...props}
      value={props.text.value}
      onChange={(e) => props.text.onChange(e.target.value)}
    />
  );
}
