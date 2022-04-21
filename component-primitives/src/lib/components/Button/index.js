import React from "react";
import { Button as RNButton, TouchableOpacity } from "react-native";

export function Button(props) {
  const { children, style, actions } = props;
  return (
    <TouchableOpacity onPress={actions?.onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
}
