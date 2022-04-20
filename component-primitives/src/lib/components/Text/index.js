import React from "react";
import { Text as RNText } from "react-native";

export function Text(props) {
  const { properties, style } = props;

  return (
    <RNText
      style={{
        height: style?.height,
        width: style?.width,
        color: style?.color,
        fontSize: style?.font?.size,
        fontStyle: style?.font?.style,
        fontWeight: style?.font?.weight,
        textAlign: style?.font?.textAlign,
        textTransform: style?.font?.textTransform,
      }}
    >
      {properties?.text}
    </RNText>
  );
}
